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
  imageUrl: string | null;
  categoryId: number;
  category: { name: string; nameAr: string };
  createdAt: Date;
};

export function mapPerfume(perfume: PerfumeWithCategory) {
  return {
    id: perfume.id,
    name: perfume.name,
    description: perfume.description,
    gender: perfume.gender.toLowerCase(),
    price: perfume.price55Ml,
    price10Ml: perfume.price10Ml,
    price30Ml: perfume.price30Ml,
    price55Ml: perfume.price55Ml,
    price100Ml: perfume.price100Ml,
    sizes: [
      { size: '10ml', price: perfume.price10Ml },
      { size: '30ml', price: perfume.price30Ml },
      { size: '55ml', price: perfume.price55Ml },
      { size: '100ml', price: perfume.price100Ml },
    ],
    imageUrl: perfume.imageUrl,
    categoryId: perfume.categoryId,
    category: perfume.category.name,
    categoryAr: perfume.category.nameAr,
    createdAt: perfume.createdAt,
  };
}
