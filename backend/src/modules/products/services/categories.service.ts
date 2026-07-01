import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isPrismaUniqueConstraintError } from '../../../common/prisma/prisma-errors.js';
import { PrismaService } from '../../../common/prisma/prisma.service.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(name: string, nameAr: string) {
    await this.ensureNameIsAvailable(name);

    return this.handleUniqueConflict(() =>
      this.prismaService.category.create({
        data: { name, nameAr },
      }),
    );
  }

  async update(id: number, name: string, nameAr: string) {
    await this.ensureExists(id);
    await this.ensureNameIsAvailable(name, id);

    return this.handleUniqueConflict(() =>
      this.prismaService.category.update({
        where: { id },
        data: { name, nameAr },
      }),
    );
  }

  async delete(id: number) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
      select: {
        id: true,
        _count: {
          select: { perfumes: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category._count.perfumes > 0) {
      throw new ConflictException(
        'Category cannot be deleted while it is used by perfumes',
      );
    }

    await this.prismaService.category.delete({ where: { id } });

    return { success: true };
  }

  private async ensureExists(id: number): Promise<void> {
    const category = await this.prismaService.category.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }
  }

  private async ensureNameIsAvailable(
    name: string,
    excludedId?: number,
  ): Promise<void> {
    const category = await this.prismaService.category.findFirst({
      where: {
        ...(excludedId ? { id: { not: excludedId } } : {}),
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
      select: { id: true },
    });

    if (category) {
      throw new ConflictException('Category already exists');
    }
  }

  private async handleUniqueConflict<T>(
    operation: () => Promise<T>,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (isPrismaUniqueConstraintError(error)) {
        throw new ConflictException('Category already exists');
      }

      throw error;
    }
  }
}
