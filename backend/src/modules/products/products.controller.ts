import {
  BadRequestException,
  Controller,
  Body,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminJwtGuard } from '../../common/auth/admin-jwt.guard.js';
import type { UploadedFile as UploadedFileType } from '../../common/types/uploaded-file.type.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { CreatePerfumeDto } from './dto/create-perfume.dto.js';
import { ProductsService } from './products.service.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAllPerfumes();
  }

  @Get('categories')
  findCategories() {
    return this.productsService.findAllCategories();
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: UploadedFileType) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.productsService.uploadProductImage(file);
  }

  @Post()
  @UseGuards(AdminJwtGuard)
  @UseInterceptors(FileInterceptor('image'))
  async createPerfume(
    @Body() body: CreatePerfumeDto,
    @UploadedFile() image: UploadedFileType,
  ) {
    if (!image) {
      throw new BadRequestException('image is required');
    }

    if (!image.mimetype?.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    return this.productsService.createPerfume({
      name: body.name,
      categoryId: body.categoryId,
      description: body.description ?? '',
      price: body.price,
      image,
    });
  }

  @Post('categories')
  @UseGuards(AdminJwtGuard)
  async createCategory(@Body() body: CreateCategoryDto) {
    return this.productsService.createCategory(body.name);
  }
}
