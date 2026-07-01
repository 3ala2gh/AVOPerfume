import { Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from '../../../common/cloudinary/cloudinary.service.js';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import type { UploadedFile } from '../../../common/types/uploaded-file.type.js';

@Injectable()
export class OffersService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly prismaService: PrismaService,
  ) {}

  findAll() {
    return this.prismaService.offer.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(image: UploadedFile) {
    const uploadedImage = await this.cloudinaryService.uploadImage(image);

    return this.prismaService.offer.create({
      data: {
        imageUrl: uploadedImage.secureUrl,
      },
    });
  }

  async delete(id: number) {
    const offer = await this.prismaService.offer.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    await this.prismaService.offer.delete({ where: { id } });

    return { success: true };
  }
}
