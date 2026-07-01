import { Body, Controller, Put, Post, UseGuards } from '@nestjs/common';
import { AdminJwtGuard } from '../../common/auth/admin-jwt.guard.js';
import { AdminService } from './admin.service.js';
import { ApplyDiscountDto } from './dto/apply-discount.dto.js';

@Controller('admin')
@UseGuards(AdminJwtGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Put('discount')
  applyDiscount(@Body() input: ApplyDiscountDto) {
    return this.adminService.applyDiscount(input);
  }

  @Post('publish-website')
  publishWebsite() {
    return this.adminService.publishWebsite();
  }
}
