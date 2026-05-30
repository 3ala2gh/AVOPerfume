import type { Product } from '../../types/product'

export type CategoryName = 'All' | string

export type Perfume = {
  id: number
  name: string
  price: number
  description: string
  category: string
  gender: 'male' | 'female' | 'unisex'
  image: string
}

export function toPerfume(product: Product): Perfume {
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    description: product.description ?? 'No description available.',
    category: product.category,
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
