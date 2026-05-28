import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service.js';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { UploadedFile } from '../../common/types/uploaded-file.type.js';

@Injectable()
export class ProductsService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly prismaService: PrismaService,
  ) {}

  findAllPerfumes() {
    return this.prismaService.perfume.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  uploadProductImage(file: UploadedFile) {
    return this.cloudinaryService.uploadImage(file);
  }
}
