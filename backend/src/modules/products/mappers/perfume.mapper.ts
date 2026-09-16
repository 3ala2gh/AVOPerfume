import type { Prisma } from '../../../generated/prisma/client.js';
import type { Gender } from '../../../generated/prisma/enums.js';

export type PerfumeWithCategory = {
  id: number;
  name: string;
  description: string | null;
  gender: Gender;
  price: Prisma.Decimal;
  price10Ml: Prisma.Decimal;
  price30Ml: Prisma.Decimal;
  price55Ml: Prisma.Decimal;
  price100Ml: Prisma.Decimal;
  is10MlEnabled: boolean;
  is30MlEnabled: boolean;
  is55MlEnabled: boolean;
  is100MlEnabled: boolean;
  discountPercent: Prisma.Decimal | null;
  isBestSeller: boolean;
  bestSellerRank: number | null;
  imageUrl: string | null;
  categoryId: number;
  category: { name: string; nameAr: string };
  createdAt: Date;
};

export type SiteSizeSettings = {
  is10MlEnabled: boolean;
  is30MlEnabled: boolean;
  is55MlEnabled: boolean;
  is100MlEnabled: boolean;
};

const ALL_SIZES_ENABLED: SiteSizeSettings = {
  is10MlEnabled: true,
  is30MlEnabled: true,
  is55MlEnabled: true,
  is100MlEnabled: true,
};

export function mapPerfume(
  perfume: PerfumeWithCategory,
  siteSettings: SiteSizeSettings = ALL_SIZES_ENABLED,
) {
  const discountPercent = perfume.discountPercent
    ? Number(perfume.discountPercent)
    : null;
  const discountMultiplier = discountPercent
    ? (100 - discountPercent) / 100
    : 1;
  const discountedPrice = (price: Prisma.Decimal) =>
    Math.round(Number(price) * discountMultiplier * 1000) / 1000;

  return {
    id: perfume.id,
    name: perfume.name,
    description: perfume.description,
    gender: perfume.gender.toLowerCase(),
    price: discountedPrice(perfume.price55Ml),
    price10Ml: discountedPrice(perfume.price10Ml),
    price30Ml: discountedPrice(perfume.price30Ml),
    price55Ml: discountedPrice(perfume.price55Ml),
    price100Ml: discountedPrice(perfume.price100Ml),
    originalPrice: Number(perfume.price55Ml),
    originalPrice10Ml: Number(perfume.price10Ml),
    originalPrice30Ml: Number(perfume.price30Ml),
    originalPrice55Ml: Number(perfume.price55Ml),
    originalPrice100Ml: Number(perfume.price100Ml),
    discountPercent,
    isBestSeller: perfume.isBestSeller,
    bestSellerRank: perfume.bestSellerRank,
    sizes: [
      {
        size: '10ml',
        price: discountedPrice(perfume.price10Ml),
        originalPrice: Number(perfume.price10Ml),
        enabled: perfume.is10MlEnabled && siteSettings.is10MlEnabled,
      },
      {
        size: '30ml',
        price: discountedPrice(perfume.price30Ml),
        originalPrice: Number(perfume.price30Ml),
        enabled: perfume.is30MlEnabled && siteSettings.is30MlEnabled,
      },
      {
        size: '55ml',
        price: discountedPrice(perfume.price55Ml),
        originalPrice: Number(perfume.price55Ml),
        enabled: perfume.is55MlEnabled && siteSettings.is55MlEnabled,
      },
      {
        size: '100ml',
        price: discountedPrice(perfume.price100Ml),
        originalPrice: Number(perfume.price100Ml),
        enabled: perfume.is100MlEnabled && siteSettings.is100MlEnabled,
      },
    ],
    imageUrl: perfume.imageUrl,
    categoryId: perfume.categoryId,
    category: perfume.category.name,
    categoryAr: perfume.category.nameAr,
    createdAt: perfume.createdAt,
  };
}
