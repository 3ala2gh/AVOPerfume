import { Controller, Post, UseGuards } from '@nestjs/common';
import { AdminJwtGuard } from '../../common/auth/admin-jwt.guard.js';
import { AdminService } from './admin.service.js';

@Controller('admin')
@UseGuards(AdminJwtGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Manual publish endpoint: admin triggers static frontend rebuild only when ready.
  @Post('publish-website')
  publishWebsite() {
    return this.adminService.publishWebsite();
  }
}
