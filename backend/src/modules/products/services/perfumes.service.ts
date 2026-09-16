import { Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from '../../../common/cloudinary/cloudinary.service.js';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import type { UploadedFile } from '../../../common/types/uploaded-file.type.js';
import { Gender } from '../../../generated/prisma/enums.js';
import {
  mapPerfume,
  type SiteSizeSettings,
} from '../mappers/perfume.mapper.js';
import type {
  CreatePerfumeInput,
  PerfumeGender,
  UpdatePerfumeInput,
} from '../types/perfume.types.js';

@Injectable()
export class PerfumesService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly prismaService: PrismaService,
  ) {}

  async findAll() {
    const [perfumes, siteSettings] = await Promise.all([
      this.prismaService.perfume.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.getSiteSizeSettings(),
    ]);

    return perfumes.map((perfume) => mapPerfume(perfume, siteSettings));
  }

  uploadImage(file: UploadedFile) {
    return this.cloudinaryService.uploadImage(file);
  }

  async create(input: CreatePerfumeInput) {
    const [uploadedImage, siteSettings] = await Promise.all([
      this.cloudinaryService.uploadImage(input.image),
      this.getSiteSizeSettings(),
    ]);
    const perfume = await this.prismaService.perfume.create({
      include: { category: true },
      data: {
        ...this.toPersistenceData(input),
        imageUrl: uploadedImage.secureUrl,
      },
    });

    return mapPerfume(perfume, siteSettings);
  }

  async update(input: UpdatePerfumeInput) {
    const existingPerfume = await this.prismaService.perfume.findUnique({
      where: { id: input.id },
      select: { id: true, imageUrl: true },
    });

    if (!existingPerfume) {
      throw new NotFoundException('Perfume not found');
    }

    const [imageUrl, siteSettings] = await Promise.all([
      input.image
        ? this.cloudinaryService
            .uploadImage(input.image)
            .then((uploaded) => uploaded.secureUrl)
        : Promise.resolve(existingPerfume.imageUrl),
      this.getSiteSizeSettings(),
    ]);
    const perfume = await this.prismaService.perfume.update({
      where: { id: input.id },
      include: { category: true },
      data: {
        ...this.toPersistenceData(input),
        imageUrl,
      },
    });

    return mapPerfume(perfume, siteSettings);
  }

  private async getSiteSizeSettings(): Promise<SiteSizeSettings> {
    const settings = await this.prismaService.siteSettings.findUnique({
      where: { id: 1 },
    });

    return {
      is10MlEnabled: settings?.is10MlEnabled ?? true,
      is30MlEnabled: settings?.is30MlEnabled ?? true,
      is55MlEnabled: settings?.is55MlEnabled ?? true,
      is100MlEnabled: settings?.is100MlEnabled ?? true,
    };
  }

  async delete(id: number) {
    await this.ensureExists(id);
    await this.prismaService.perfume.delete({ where: { id } });

    return { success: true };
  }

  private async ensureExists(id: number): Promise<void> {
    const perfume = await this.prismaService.perfume.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!perfume) {
      throw new NotFoundException('Perfume not found');
    }
  }

  private toPersistenceData(input: CreatePerfumeInput | UpdatePerfumeInput) {
    return {
      name: input.name,
      description: input.description,
      gender: this.toDatabaseGender(input.gender),
      categoryId: input.categoryId,
      price: input.price55Ml,
      price10Ml: input.price10Ml,
      price30Ml: input.price30Ml,
      price55Ml: input.price55Ml,
      price100Ml: input.price100Ml,
      is10MlEnabled: input.is10MlEnabled ?? true,
      is30MlEnabled: input.is30MlEnabled ?? true,
      is55MlEnabled: input.is55MlEnabled ?? true,
      is100MlEnabled: input.is100MlEnabled ?? true,
    };
  }

  private toDatabaseGender(gender: PerfumeGender): Gender {
    return Gender[gender.toUpperCase() as keyof typeof Gender];
  }
}
