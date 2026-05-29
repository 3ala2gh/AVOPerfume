import { ConflictException, Injectable } from '@nestjs/common';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service.js';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { UploadedFile } from '../../common/types/uploaded-file.type.js';
import { Prisma } from '../../generated/prisma/client.js';

type CreatePerfumeParams = {
  name: string;
  description: string;
  categoryId: number;
  price: number;
  image: UploadedFile;
};

@Injectable()
export class ProductsService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly prismaService: PrismaService,
  ) {}

  findAllPerfumes() {
    return this.prismaService.perfume
      .findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      })
      .then((perfumes) =>
        perfumes.map((perfume) => ({
          id: perfume.id,
          name: perfume.name,
          description: perfume.description,
          price: perfume.price,
          imageUrl: perfume.imageUrl,
          category: perfume.category.name,
          createdAt: perfume.createdAt,
        })),
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
          categoryId,
          price,
          imageUrl: uploadedImage.secureUrl,
        },
      })
      .then((perfume) => ({
        id: perfume.id,
        name: perfume.name,
        description: perfume.description,
        price: perfume.price,
        imageUrl: perfume.imageUrl,
        category: perfume.category.name,
        createdAt: perfume.createdAt,
      }));
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
