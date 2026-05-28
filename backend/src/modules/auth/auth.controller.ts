import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import type { AuthResponse } from './auth.service.js';

type LoginBody = {
  email?: string;
  password?: string;
};

type RegisterBody = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginBody): Promise<AuthResponse> {
    const email = body?.email?.trim();
    const password = body?.password;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    return this.authService.login(email, password);
  }

  @Post('register')
  register(@Body() body: RegisterBody): Promise<AuthResponse> {
    const email = body?.email?.trim();
    const password = body?.password;
    const confirmPassword = body?.confirmPassword;

    if (!email || !password || !confirmPassword) {
      throw new BadRequestException(
        'Email, password and confirmPassword are required',
      );
    }

    return this.authService.register(email, password, confirmPassword);
  }
}
