import {
  BadRequestException,
  Controller,
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ParseIntPipe,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminJwtGuard } from '../../common/auth/admin-jwt.guard.js';
import type { UploadedFile as UploadedFileType } from '../../common/types/uploaded-file.type.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { CreatePerfumeDto } from './dto/create-perfume.dto.js';
import { UpdatePerfumeDto } from './dto/update-perfume.dto.js';
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
      gender: body.gender,
      price: body.price,
      image,
    });
  }

  @Post('categories')
  @UseGuards(AdminJwtGuard)
  async createCategory(@Body() body: CreateCategoryDto) {
    return this.productsService.createCategory(body.name);
  }

  @Put(':id')
  @UseGuards(AdminJwtGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updatePerfume(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePerfumeDto,
    @UploadedFile() image?: UploadedFileType,
  ) {
    if (image && !image.mimetype?.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    return this.productsService.updatePerfume({
      id,
      name: body.name,
      description: body.description,
      gender: body.gender,
      categoryId: body.categoryId,
      price: body.price,
      image,
    });
  }

  @Delete(':id')
  @UseGuards(AdminJwtGuard)
  async deletePerfume(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deletePerfume(id);
  }
}
