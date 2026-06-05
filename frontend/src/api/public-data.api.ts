import type { Category, Offer, Product } from '../types/product'
import { listOffersFromApi } from './offers.api'
import { listCategoriesFromApi, listProductsFromApi } from './products.api'

function normalizeProduct(item: Product): Product {
  const price30Ml = Number(item.price30Ml ?? item.sizes?.find((size) => size.size === '30ml')?.price ?? 6)
  const price55Ml = Number(item.price55Ml ?? item.sizes?.find((size) => size.size === '55ml')?.price ?? item.price)
  const price100Ml = Number(item.price100Ml ?? item.sizes?.find((size) => size.size === '100ml')?.price ?? 15)

  return {
    ...item,
    price: price55Ml,
    price30Ml,
    price55Ml,
    price100Ml,
    sizes: [
      { size: '30ml', price: price30Ml },
      { size: '55ml', price: price55Ml },
      { size: '100ml', price: price100Ml },
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
