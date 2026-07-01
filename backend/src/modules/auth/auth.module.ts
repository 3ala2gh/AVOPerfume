import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { PasswordService } from '../../common/auth/password.service.js';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PasswordService],
})
export class AuthModule {}
