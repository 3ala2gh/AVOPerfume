import { Module } from '@nestjs/common';
import { AdminJwtGuard } from '../../common/auth/admin-jwt.guard.js';
import { CloudinaryModule } from '../../common/cloudinary/cloudinary.module.js';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';

@Module({
  imports: [CloudinaryModule],
  controllers: [ProductsController],
  providers: [ProductsService, AdminJwtGuard],
})
export class ProductsModule {}
