import { Body, Controller, Put, Post, UseGuards } from '@nestjs/common';
import { AdminJwtGuard } from '../../common/auth/admin-jwt.guard.js';
import { AdminService } from './admin.service.js';
import { ApplyDiscountDto } from './dto/apply-discount.dto.js';
import { UpdateBestSellersDto } from './dto/update-best-sellers.dto.js';

@Controller('admin')
@UseGuards(AdminJwtGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Put('discount')
  applyDiscount(@Body() input: ApplyDiscountDto) {
    return this.adminService.applyDiscount(input);
  }

  @Put('best-sellers')
  updateBestSellers(@Body() input: UpdateBestSellersDto) {
    return this.adminService.updateBestSellers(input.perfumeIds);
  }

  @Post('publish-website')
  publishWebsite() {
    return this.adminService.publishWebsite();
  }
}
