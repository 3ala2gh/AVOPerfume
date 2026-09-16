import type { Category, Offer, Product } from '../types/product'
import { listOffersFromApi } from './offers.api'
import { listCategoriesFromApi, listProductsFromApi } from './products.api'

function normalizeProduct(item: Product): Product {
  const price10Ml = Number(item.price10Ml ?? item.sizes?.find((size) => size.size === '10ml')?.price ?? 2)
  const price30Ml = Number(item.price30Ml ?? item.sizes?.find((size) => size.size === '30ml')?.price ?? 6)
  const price55Ml = Number(item.price55Ml ?? item.sizes?.find((size) => size.size === '55ml')?.price ?? item.price)
  const price100Ml = Number(item.price100Ml ?? item.sizes?.find((size) => size.size === '100ml')?.price ?? 15)

  return {
    ...item,
    price: price55Ml,
    price10Ml,
    price30Ml,
    price55Ml,
    price100Ml,
    sizes: [
      { size: '10ml', price: price10Ml, originalPrice: Number(item.originalPrice10Ml ?? price10Ml), enabled: item.sizes?.find((size) => size.size === '10ml')?.enabled ?? true },
      { size: '30ml', price: price30Ml, originalPrice: Number(item.originalPrice30Ml ?? price30Ml), enabled: item.sizes?.find((size) => size.size === '30ml')?.enabled ?? true },
      { size: '55ml', price: price55Ml, originalPrice: Number(item.originalPrice55Ml ?? item.originalPrice ?? price55Ml), enabled: item.sizes?.find((size) => size.size === '55ml')?.enabled ?? true },
      { size: '100ml', price: price100Ml, originalPrice: Number(item.originalPrice100Ml ?? price100Ml), enabled: item.sizes?.find((size) => size.size === '100ml')?.enabled ?? true },
    ],
  }
}

async function fetchStaticJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`Failed to load static file: ${path}`)
  }

  return (await response.json()) as T
}


async function withPublicFallback<T>(
  staticPath: string,
  fallbackApi: () => Promise<T>,
): Promise<T> {
  try {
    return await fetchStaticJson<T>(staticPath)
  } catch {
    return fallbackApi()
  }
}

export async function listPublicProducts(): Promise<Product[]> {
  const products = await withPublicFallback('/data/products.json', async () => {
    const products = await listProductsFromApi()
    return products
  })
  return products.map(normalizeProduct)
}

export async function listPublicCategories(): Promise<Category[]> {
  return withPublicFallback('/data/categories.json', () => listCategoriesFromApi())
}

export async function listPublicOffers(): Promise<Offer[]> {
  return withPublicFallback('/data/offers.json', () => listOffersFromApi())
}
