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
    price30Ml: Number(item.price30Ml ?? item.sizes?.find((size) => size.size === '30ml')?.price ?? 6),
    price55Ml: Number(item.price55Ml ?? item.sizes?.find((size) => size.size === '55ml')?.price ?? item.price),
    price100Ml: Number(item.price100Ml ?? item.sizes?.find((size) => size.size === '100ml')?.price ?? 15),
    sizes: [
      { size: '30ml', price: Number(item.price30Ml ?? item.sizes?.find((size) => size.size === '30ml')?.price ?? 6) },
      { size: '55ml', price: Number(item.price55Ml ?? item.sizes?.find((size) => size.size === '55ml')?.price ?? item.price) },
      { size: '100ml', price: Number(item.price100Ml ?? item.sizes?.find((size) => size.size === '100ml')?.price ?? 15) },
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
  formData.append('price30Ml', String(payload.price30Ml))
  formData.append('price55Ml', String(payload.price55Ml))
  formData.append('price100Ml', String(payload.price100Ml))
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
  formData.append('price30Ml', String(payload.price30Ml))
  formData.append('price55Ml', String(payload.price55Ml))
  formData.append('price100Ml', String(payload.price100Ml))

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
