import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service.js';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { UploadedFile } from '../../common/types/uploaded-file.type.js';
import { Prisma } from '../../generated/prisma/client.js';

type GenderInput = 'male' | 'female' | 'unisex';
type GenderDb = 'MALE' | 'FEMALE' | 'UNISEX';

type CreatePerfumeParams = {
  name: string;
  description: string;
  gender: GenderInput;
  categoryId: number;
  price: number;
  image: UploadedFile;
};

type UpdatePerfumeParams = {
  id: number;
  name: string;
  description: string;
  gender: GenderInput;
  categoryId: number;
  price: number;
  image?: UploadedFile;
};

@Injectable()
export class ProductsService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly prismaService: PrismaService,
  ) {}

  private mapPerfumeWithCategory(perfume: {
    id: number;
    name: string;
    description: string | null;
    gender: GenderDb;
    price: Prisma.Decimal;
    imageUrl: string | null;
    categoryId: number;
    category: { name: string };
    createdAt: Date;
  }) {
    return {
      id: perfume.id,
      name: perfume.name,
      description: perfume.description,
      gender: perfume.gender.toLowerCase(),
      price: perfume.price,
      imageUrl: perfume.imageUrl,
      categoryId: perfume.categoryId,
      category: perfume.category.name,
      createdAt: perfume.createdAt,
    };
  }

  findAllPerfumes() {
    return this.prismaService.perfume
      .findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      })
      .then((perfumes) =>
        perfumes.map((perfume) => this.mapPerfumeWithCategory(perfume)),
      );
  }

  findAllCategories() {
    return this.prismaService.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  uploadProductImage(file: UploadedFile) {
    return this.cloudinaryService.uploadImage(file);
  }

  async createPerfume({
    name,
    description,
    gender,
    categoryId,
    price,
    image,
  }: CreatePerfumeParams) {
    const uploadedImage = await this.cloudinaryService.uploadImage(image);

    return this.prismaService.perfume
      .create({
        include: { category: true },
        data: {
          name,
          description,
          gender: gender.toUpperCase() as GenderDb,
          categoryId,
          price,
          imageUrl: uploadedImage.secureUrl,
        },
      })
      .then((perfume) => this.mapPerfumeWithCategory(perfume));
  }

  async updatePerfume({
    id,
    name,
    description,
    gender,
    categoryId,
    price,
    image,
  }: UpdatePerfumeParams) {
    const existingPerfume = await this.prismaService.perfume.findUnique({
      where: { id },
      select: { id: true, imageUrl: true },
    });

    if (!existingPerfume) {
      throw new NotFoundException('Perfume not found');
    }

    const imageUrl = image
      ? (await this.cloudinaryService.uploadImage(image)).secureUrl
      : existingPerfume.imageUrl;

    return this.prismaService.perfume
      .update({
        where: { id },
        include: { category: true },
        data: {
          name,
          description,
          gender: gender.toUpperCase() as GenderDb,
          categoryId,
          price,
          imageUrl,
        },
      })
      .then((perfume) => this.mapPerfumeWithCategory(perfume));
  }

  async deletePerfume(id: number) {
    const existingPerfume = await this.prismaService.perfume.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingPerfume) {
      throw new NotFoundException('Perfume not found');
    }

    await this.prismaService.perfume.delete({
      where: { id },
    });

    return { success: true };
  }

  async createCategory(name: string) {
    const existing = await this.prismaService.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });
    if (existing) {
      throw new ConflictException('Category already exists');
    }

    try {
      return await this.prismaService.category.create({
        data: { name },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Category already exists');
      }
      throw error;
    }
  }
}
