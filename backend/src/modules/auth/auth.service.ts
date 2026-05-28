import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { TokenService } from './token.service.js';

export type AuthResponse = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!(await this.verifyPassword(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.tokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role.name,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    };
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

    if (password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const userRole = await this.prismaService.role.findUnique({
      where: { name: 'user' },
    });

    if (!userRole) {
      throw new InternalServerErrorException(
        'User role is missing. Run seed/migrations first.',
      );
    }

    const derivedName = email.split('@')[0] ?? 'User';
    const user = await this.prismaService.user.create({
      data: {
        name: derivedName,
        email,
        password: await this.hashPassword(password),
        roleId: userRole.id,
      },
      include: { role: true },
    });

    const token = this.tokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role.name,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    };
  }

  private hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  private verifyPassword(
    plainPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, storedPassword);
  }
}
