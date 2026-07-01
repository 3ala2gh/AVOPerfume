import { Module } from '@nestjs/common';
import { AdminJwtGuard } from '../../common/auth/admin-jwt.guard.js';
import { CloudinaryModule } from '../../common/cloudinary/cloudinary.module.js';
import { ProductsController } from './products.controller.js';
import { CategoriesService } from './services/categories.service.js';
import { OffersService } from './services/offers.service.js';
import { PerfumesService } from './services/perfumes.service.js';

@Module({
  imports: [CloudinaryModule],
  controllers: [ProductsController],
  providers: [CategoriesService, OffersService, PerfumesService, AdminJwtGuard],
})
export class ProductsModule {}
