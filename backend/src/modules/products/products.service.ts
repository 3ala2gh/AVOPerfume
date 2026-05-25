import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  uploadProductImage(file: Express.Multer.File) {
    return this.cloudinaryService.uploadImage(file);
  }
}
