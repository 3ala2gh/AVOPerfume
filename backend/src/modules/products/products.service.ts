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
  price30Ml: number;
  price55Ml: number;
  price100Ml: number;
  image: UploadedFile;
};

type UpdatePerfumeParams = {
  id: number;
  name: string;
  description: string;
  gender: GenderInput;
  categoryId: number;
  price: number;
  price30Ml: number;
  price55Ml: number;
  price100Ml: number;
  image?: UploadedFile;
};

type CreateOfferParams = {
  image: UploadedFile;
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
    price30Ml: Prisma.Decimal;
    price55Ml: Prisma.Decimal;
    price100Ml: Prisma.Decimal;
    imageUrl: string | null;
    categoryId: number;
    category: { name: string; nameAr: string };
    createdAt: Date;
  }) {
    return {
      id: perfume.id,
      name: perfume.name,
      description: perfume.description,
      gender: perfume.gender.toLowerCase(),
      price: perfume.price55Ml,
      price30Ml: perfume.price30Ml,
      price55Ml: perfume.price55Ml,
      price100Ml: perfume.price100Ml,
      sizes: [
        { size: '30ml', price: perfume.price30Ml },
        { size: '55ml', price: perfume.price55Ml },
        { size: '100ml', price: perfume.price100Ml },
      ],
      imageUrl: perfume.imageUrl,
      categoryId: perfume.categoryId,
      category: perfume.category.name,
      categoryAr: perfume.category.nameAr,
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

  findAllOffers() {
    return this.prismaService.offer.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createOffer({ image }: CreateOfferParams) {
    const uploadedImage = await this.cloudinaryService.uploadImage(image);

    return this.prismaService.offer.create({
      data: {
        imageUrl: uploadedImage.secureUrl,
      },
    });
  }

  async deleteOffer(id: number) {
    const existingOffer = await this.prismaService.offer.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingOffer) {
      throw new NotFoundException('Offer not found');
    }

    await this.prismaService.offer.delete({
      where: { id },
    });

    return { success: true };
  }

  async createPerfume({
    name,
    description,
    gender,
    categoryId,
    price,
    price30Ml,
    price55Ml,
    price100Ml,
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
          price: price55Ml ?? price,
          price30Ml,
          price55Ml,
          price100Ml,
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
    price30Ml,
    price55Ml,
    price100Ml,
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
          price: price55Ml ?? price,
          price30Ml,
          price55Ml,
          price100Ml,
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

  async createCategory(name: string, nameAr: string) {
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
        data: { name, nameAr },
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

  async updateCategory(id: number, name: string, nameAr: string) {
    const existingCategory = await this.prismaService.category.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    const duplicateCategory = await this.prismaService.category.findFirst({
      where: {
        id: { not: id },
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
      select: { id: true },
    });

    if (duplicateCategory) {
      throw new ConflictException('Category already exists');
    }

    try {
      return await this.prismaService.category.update({
        where: { id },
        data: { name, nameAr },
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

  async deleteCategory(id: number) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
      select: {
        id: true,
        _count: {
          select: { perfumes: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category._count.perfumes > 0) {
      throw new ConflictException(
        'Category cannot be deleted while it is used by perfumes',
      );
    }

    await this.prismaService.category.delete({ where: { id } });

    return { success: true };
  }
}
