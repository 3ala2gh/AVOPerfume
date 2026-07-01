import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminJwtGuard } from '../../common/auth/admin-jwt.guard.js';
import { ImageFilePipe } from '../../common/files/image-file.pipe.js';
import { IMAGE_UPLOAD_OPTIONS } from '../../common/files/image-upload.constants.js';
import type { UploadedFile as UploadedFileType } from '../../common/types/uploaded-file.type.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { CreatePerfumeDto } from './dto/create-perfume.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { UpdatePerfumeDto } from './dto/update-perfume.dto.js';
import { CategoriesService } from './services/categories.service.js';
import { OffersService } from './services/offers.service.js';
import { PerfumesService } from './services/perfumes.service.js';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly offersService: OffersService,
    private readonly perfumesService: PerfumesService,
  ) {}

  @Get()
  findAllPerfumes() {
    return this.perfumesService.findAll();
  }

  @Get('categories')
  findCategories() {
    return this.categoriesService.findAll();
  }

  @Get('offers')
  findOffers() {
    return this.offersService.findAll();
  }

  @Post('upload-image')
  @UseGuards(AdminJwtGuard)
  @UseInterceptors(FileInterceptor('file', IMAGE_UPLOAD_OPTIONS))
  uploadImage(
    @UploadedFile(new ImageFilePipe({ required: true }))
    file: UploadedFileType,
  ) {
    return this.perfumesService.uploadImage(file);
  }

  @Post()
  @UseGuards(AdminJwtGuard)
  @UseInterceptors(FileInterceptor('image', IMAGE_UPLOAD_OPTIONS))
  createPerfume(
    @Body() body: CreatePerfumeDto,
    @UploadedFile(new ImageFilePipe({ required: true }))
    image: UploadedFileType,
  ) {
    return this.perfumesService.create({
      ...body,
      description: body.description ?? '',
      image,
    });
  }

  @Post('categories')
  @UseGuards(AdminJwtGuard)
  createCategory(@Body() body: CreateCategoryDto) {
    return this.categoriesService.create(body.name, body.nameAr);
  }

  @Put('categories/:id')
  @UseGuards(AdminJwtGuard)
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, body.name, body.nameAr);
  }

  @Delete('categories/:id')
  @UseGuards(AdminJwtGuard)
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.delete(id);
  }

  @Post('offers')
  @UseGuards(AdminJwtGuard)
  @UseInterceptors(FileInterceptor('image', IMAGE_UPLOAD_OPTIONS))
  createOffer(
    @UploadedFile(new ImageFilePipe({ required: true }))
    image: UploadedFileType,
  ) {
    return this.offersService.create(image);
  }

  @Put(':id')
  @UseGuards(AdminJwtGuard)
  @UseInterceptors(FileInterceptor('image', IMAGE_UPLOAD_OPTIONS))
  updatePerfume(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePerfumeDto,
    @UploadedFile(new ImageFilePipe()) image?: UploadedFileType,
  ) {
    return this.perfumesService.update({
      id,
      ...body,
      image,
    });
  }

  @Delete(':id')
  @UseGuards(AdminJwtGuard)
  deletePerfume(@Param('id', ParseIntPipe) id: number) {
    return this.perfumesService.delete(id);
  }

  @Delete('offers/:id')
  @UseGuards(AdminJwtGuard)
  deleteOffer(@Param('id', ParseIntPipe) id: number) {
    return this.offersService.delete(id);
  }
}
