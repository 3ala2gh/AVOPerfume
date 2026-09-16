import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import type { ApplyDiscountDto } from './dto/apply-discount.dto.js';
import type { UpdateSizeSettingsDto } from './dto/update-size-settings.dto.js';

const SITE_SETTINGS_ID = 1;

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSizeSettings() {
    return this.prismaService.siteSettings.upsert({
      where: { id: SITE_SETTINGS_ID },
      update: {},
      create: { id: SITE_SETTINGS_ID },
    });
  }

  async updateSizeSettings(input: UpdateSizeSettingsDto) {
    return this.prismaService.siteSettings.upsert({
      where: { id: SITE_SETTINGS_ID },
      update: input,
      create: { id: SITE_SETTINGS_ID, ...input },
    });
  }

  async applyDiscount(input: ApplyDiscountDto) {
    const where = input.applyToAll ? {} : { id: { in: input.perfumeIds } };
    const result = await this.prismaService.perfume.updateMany({
      where,
      data: { discountPercent: input.discountPercent || null },
    });

    return { success: true, updatedCount: result.count };
  }

  async updateBestSellers(perfumeIds: number[]) {
    const existingCount = await this.prismaService.perfume.count({
      where: { id: { in: perfumeIds } },
    });

    if (existingCount !== perfumeIds.length) {
      throw new BadRequestException(
        'One or more selected perfumes do not exist.',
      );
    }

    await this.prismaService.$transaction([
      this.prismaService.perfume.updateMany({
        where: { isBestSeller: true },
        data: { isBestSeller: false, bestSellerRank: null },
      }),
      ...perfumeIds.map((id, index) =>
        this.prismaService.perfume.update({
          where: { id },
          data: { isBestSeller: true, bestSellerRank: index + 1 },
        }),
      ),
    ]);

    return { success: true, updatedCount: perfumeIds.length };
  }

  async publishWebsite() {
    const deployHookUrl = process.env.FRONTEND_DEPLOY_HOOK_URL?.trim();

    if (!deployHookUrl) {
      throw new BadRequestException(
        'FRONTEND_DEPLOY_HOOK_URL is not configured on the backend.',
      );
    }

    try {
      const response = await fetch(deployHookUrl, {
        method: 'POST',
      });

      if (!response.ok) {
        const responseBody = await response.text();
        throw new InternalServerErrorException(
          `Deploy hook request failed with status ${response.status}. Response: ${responseBody || 'empty body'}`,
        );
      }

      return {
        success: true,
        message: 'Frontend publish hook triggered successfully.',
      };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Unable to trigger frontend publish hook.',
      );
    }
  }
}
