import type { Category, Offer, Product } from '../types/product'
import { listOffersFromApi } from './offers.api'
import { listCategoriesFromApi, listProductsFromApi } from './products.api'

async function fetchStaticJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`Failed to load static file: ${path}`)
  }

  return (await response.json()) as T
}

// Public pages prefer static JSON to avoid dependency on a sleeping backend.
// Fallback to API is used only when static JSON is missing or stale/corrupt.
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
  return withPublicFallback('/data/products.json', async () => {
    const products = await listProductsFromApi()
    return products.map((item) => ({
      ...item,
      price: Number(item.price),
    }))
  })
}

export async function listPublicCategories(): Promise<Category[]> {
  return withPublicFallback('/data/categories.json', () => listCategoriesFromApi())
}

export async function listPublicOffers(): Promise<Offer[]> {
  return withPublicFallback('/data/offers.json', () => listOffersFromApi())
}
