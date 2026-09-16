import type { PerfumeSize, Product, ProductSizePrice } from '../../types/product'

export type CategoryName = 'All' | string

export type Perfume = {
  id: number
  name: string
  price: number
  price10Ml: number
  price30Ml: number
  price55Ml: number
  price100Ml: number
  sizes: ProductSizePrice[]
  discountPercent: number | null
  isBestSeller: boolean
  bestSellerRank: number | null
  originalPrice: number
  description: string
  category: string
  categoryAr: string
  gender: 'male' | 'female' | 'unisex'
  image: string
}

export const DEFAULT_PERFUME_SIZE: PerfumeSize = '55ml'
export const DEFAULT_PERFUME_SIZE_PRICES: Record<PerfumeSize, number> = {
  '10ml': 2,
  '30ml': 6,
  '55ml': 8,
  '100ml': 15,
}

export const PERFUME_SIZE_OPTIONS: PerfumeSize[] = ['10ml', '30ml', '55ml', '100ml']

export function getPerfumeSizePrice(
  perfume: Pick<Perfume, 'sizes'>,
  size: PerfumeSize,
): number {
  return perfume.sizes.find((item) => item.size === size)?.price ?? DEFAULT_PERFUME_SIZE_PRICES[size]
}

function normalizeProductSizes(product: Product): ProductSizePrice[] {
  return PERFUME_SIZE_OPTIONS.map((size) => ({
    size,
    price: Number(
      product.sizes?.find((item) => item.size === size)?.price ??
        (size === '10ml'
          ? product.price10Ml
          : size === '30ml'
            ? product.price30Ml
            : size === '55ml'
              ? product.price55Ml
              : product.price100Ml) ??
        DEFAULT_PERFUME_SIZE_PRICES[size],
    ),
    originalPrice: Number(
      product.sizes?.find((item) => item.size === size)?.originalPrice ??
        (size === '10ml' ? product.originalPrice10Ml : size === '30ml' ? product.originalPrice30Ml : size === '55ml' ? product.originalPrice55Ml : product.originalPrice100Ml) ??
        product.sizes?.find((item) => item.size === size)?.price ??
        DEFAULT_PERFUME_SIZE_PRICES[size],
    ),
    enabled: product.sizes?.find((item) => item.size === size)?.enabled ?? true,
  }))
}

export function toPerfume(product: Product): Perfume {
  const sizes = normalizeProductSizes(product)
  const price55Ml = getPerfumeSizePrice({ sizes }, DEFAULT_PERFUME_SIZE)

  return {
    id: product.id,
    name: product.name,
    price: price55Ml,
    price10Ml: getPerfumeSizePrice({ sizes }, '10ml'),
    price30Ml: getPerfumeSizePrice({ sizes }, '30ml'),
    price55Ml,
    price100Ml: getPerfumeSizePrice({ sizes }, '100ml'),
    sizes,
    discountPercent: product.discountPercent ?? null,
    isBestSeller: product.isBestSeller ?? false,
    bestSellerRank: product.bestSellerRank ?? null,
    originalPrice: product.originalPrice55Ml ?? product.originalPrice ?? price55Ml,
    description: product.description ?? 'No description available.',
    category: product.category,
    categoryAr: product.categoryAr ?? product.category,
    gender: product.gender ?? 'unisex',
    image: product.imageUrl ?? '',
  }
}

export function toPerfumes(products: Product[]): Perfume[] {
  return products.map(toPerfume)
}

export function getCategoryOrder(perfumes: Perfume[]): CategoryName[] {
  const categories = Array.from(new Set(perfumes.map((perfume) => perfume.category))).filter(Boolean)
  return ['All', ...categories]
}

export function filterPerfumes(perfumes: Perfume[], selectedCategory: CategoryName): Perfume[] {
  if (selectedCategory === 'All') {
    return perfumes
  }

  if (selectedCategory === 'Men') {
    return perfumes.filter((perfume) => perfume.gender === 'male')
  }

  if (selectedCategory === 'Women') {
    return perfumes.filter((perfume) => perfume.gender === 'female')
  }

  return perfumes.filter((perfume) => perfume.category === selectedCategory)
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function perfumeToSlug(name: string): string {
  return normalize(name).replace(/[^a-z0-9]+/g, '-')
}

export function findPerfumeBySlug(perfumes: Perfume[], slug: string): Perfume | undefined {
  return perfumes.find((perfume) => perfumeToSlug(perfume.name) === slug)
}

export function findPerfumeByQuery(perfumes: Perfume[], query: string): Perfume | undefined {
  const normalizedQuery = normalize(query)
  if (!normalizedQuery) {
    return undefined
  }

  return (
    perfumes.find((perfume) => normalize(perfume.name) === normalizedQuery) ??
    perfumes.find((perfume) => normalize(perfume.name).includes(normalizedQuery))
  )
}
