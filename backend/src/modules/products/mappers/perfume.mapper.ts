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
  discountPercent: Prisma.Decimal | null;
  imageUrl: string | null;
  categoryId: number;
  category: { name: string; nameAr: string };
  createdAt: Date;
};

export function mapPerfume(perfume: PerfumeWithCategory) {
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
    sizes: [
      { size: '10ml', price: discountedPrice(perfume.price10Ml), originalPrice: Number(perfume.price10Ml) },
      { size: '30ml', price: discountedPrice(perfume.price30Ml), originalPrice: Number(perfume.price30Ml) },
      { size: '55ml', price: discountedPrice(perfume.price55Ml), originalPrice: Number(perfume.price55Ml) },
      { size: '100ml', price: discountedPrice(perfume.price100Ml), originalPrice: Number(perfume.price100Ml) },
    ],
    imageUrl: perfume.imageUrl,
    categoryId: perfume.categoryId,
    category: perfume.category.name,
    categoryAr: perfume.category.nameAr,
    createdAt: perfume.createdAt,
  };
}
