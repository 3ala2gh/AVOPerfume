import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthTokenService } from '../../common/auth/auth-token.service.js';
import { PasswordService } from '../../common/auth/password.service.js';
import { isPrismaUniqueConstraintError } from '../../common/prisma/prisma-errors.js';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { mapAuthResponse } from './mappers/auth-response.mapper.js';
import type { AuthResponse } from './types/auth-response.type.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokenService: AuthTokenService,
    private readonly passwordService: PasswordService,
  ) {}

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (
      !user ||
      !(await this.passwordService.verify(password, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return mapAuthResponse(user, this.tokenService);
  }

  async register(
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<AuthResponse> {
    if (password !== confirmPassword) {
      throw new BadRequestException(
        'Password and confirmPassword do not match',
      );
    }

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const userRole = await this.prismaService.role.findUnique({
      where: { name: 'user' },
      select: { id: true },
    });

    if (!userRole) {
      throw new InternalServerErrorException(
        'User role is missing. Run seed/migrations first.',
      );
    }

    const user = await this.createUser({
      email,
      password,
      roleId: userRole.id,
    });

    return mapAuthResponse(user, this.tokenService);
  }

  private async createUser(input: {
    email: string;
    password: string;
    roleId: number;
  }) {
    try {
      return await this.prismaService.user.create({
        data: {
          name: this.deriveName(input.email),
          email: input.email,
          password: await this.passwordService.hash(input.password),
          roleId: input.roleId,
        },
        include: { role: true },
      });
    } catch (error) {
      if (isPrismaUniqueConstraintError(error)) {
        throw new ConflictException('Email is already registered');
      }

      throw error;
    }
  }

  private deriveName(email: string): string {
    return email.split('@')[0] || 'User';
  }
}
