import { api } from './api'
import type {
  Category,
  CategoryInput,
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../types/product'

export async function listProductsFromApi(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/products')
  return data.map((item) => ({
    ...item,
    price: Number(item.price),
    price10Ml: Number(item.price10Ml ?? item.sizes?.find((size) => size.size === '10ml')?.price ?? 2),
    price30Ml: Number(item.price30Ml ?? item.sizes?.find((size) => size.size === '30ml')?.price ?? 6),
    price55Ml: Number(item.price55Ml ?? item.sizes?.find((size) => size.size === '55ml')?.price ?? item.price),
    price100Ml: Number(item.price100Ml ?? item.sizes?.find((size) => size.size === '100ml')?.price ?? 15),
    sizes: [
      { size: '10ml', price: Number(item.price10Ml ?? 2), originalPrice: Number(item.originalPrice10Ml ?? item.price10Ml ?? 2), enabled: item.sizes?.find((size) => size.size === '10ml')?.enabled ?? true },
      { size: '30ml', price: Number(item.price30Ml ?? 6), originalPrice: Number(item.originalPrice30Ml ?? item.price30Ml ?? 6), enabled: item.sizes?.find((size) => size.size === '30ml')?.enabled ?? true },
      { size: '55ml', price: Number(item.price55Ml ?? item.price), originalPrice: Number(item.originalPrice55Ml ?? item.originalPrice ?? item.price55Ml ?? item.price), enabled: item.sizes?.find((size) => size.size === '55ml')?.enabled ?? true },
      { size: '100ml', price: Number(item.price100Ml ?? 15), originalPrice: Number(item.originalPrice100Ml ?? item.price100Ml ?? 15), enabled: item.sizes?.find((size) => size.size === '100ml')?.enabled ?? true },
    ],
  }))
}

export async function createProduct(payload: CreateProductInput): Promise<Product> {
  const formData = new FormData()

  formData.append('name', payload.name)
  formData.append('description', payload.description)
  formData.append('gender', payload.gender)
  formData.append('categoryId', String(payload.categoryId))
  formData.append('price', String(payload.price))
  formData.append('price10Ml', String(payload.price10Ml))
  formData.append('price30Ml', String(payload.price30Ml))
  formData.append('price55Ml', String(payload.price55Ml))
  formData.append('price100Ml', String(payload.price100Ml))
  formData.append('is10MlEnabled', String(payload.is10MlEnabled ?? true))
  formData.append('is30MlEnabled', String(payload.is30MlEnabled ?? true))
  formData.append('is55MlEnabled', String(payload.is55MlEnabled ?? true))
  formData.append('is100MlEnabled', String(payload.is100MlEnabled ?? true))
  formData.append('image', payload.image)

  const { data } = await api.post<Product>('/products', formData)

  return data
}

export async function updateProduct(payload: UpdateProductInput): Promise<Product> {
  const formData = new FormData()

  formData.append('name', payload.name)
  formData.append('description', payload.description)
  formData.append('gender', payload.gender)
  formData.append('categoryId', String(payload.categoryId))
  formData.append('price', String(payload.price))
  formData.append('price10Ml', String(payload.price10Ml))
  formData.append('price30Ml', String(payload.price30Ml))
  formData.append('price55Ml', String(payload.price55Ml))
  formData.append('price100Ml', String(payload.price100Ml))
  formData.append('is10MlEnabled', String(payload.is10MlEnabled ?? true))
  formData.append('is30MlEnabled', String(payload.is30MlEnabled ?? true))
  formData.append('is55MlEnabled', String(payload.is55MlEnabled ?? true))
  formData.append('is100MlEnabled', String(payload.is100MlEnabled ?? true))

  if (payload.image) {
    formData.append('image', payload.image)
  }

  const { data } = await api.put<Product>(`/products/${payload.id}`, formData)

  return {
    ...data,
    price: Number(data.price),
  }
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`)
}

export async function listCategoriesFromApi(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/products/categories')
  return data
}

export async function createCategory(payload: CategoryInput): Promise<Category> {
  const { data } = await api.post<Category>('/products/categories', payload)

  return data
}

export async function updateCategory(
  id: number,
  payload: CategoryInput,
): Promise<Category> {
  const { data } = await api.put<Category>(`/products/categories/${id}`, payload)

  return data
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/products/categories/${id}`)
}
