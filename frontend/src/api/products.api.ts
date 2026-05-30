import { api } from './api'
import type { Category, CreateProductInput, Product, UpdateProductInput } from '../types/product'

export async function listProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/products')
  return data.map((item) => ({
    ...item,
    price: Number(item.price),
  }))
}

export async function createProduct(payload: CreateProductInput): Promise<Product> {
  const token = window.localStorage.getItem('avo_admin_token')
  const formData = new FormData()

  formData.append('name', payload.name)
  formData.append('description', payload.description)
  formData.append('gender', payload.gender)
  formData.append('categoryId', String(payload.categoryId))
  formData.append('price', String(payload.price))
  formData.append('image', payload.image)

  const { data } = await api.post<Product>('/products', formData, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  return data
}

export async function updateProduct(payload: UpdateProductInput): Promise<Product> {
  const token = window.localStorage.getItem('avo_admin_token')
  const formData = new FormData()

  formData.append('name', payload.name)
  formData.append('description', payload.description)
  formData.append('gender', payload.gender)
  formData.append('categoryId', String(payload.categoryId))
  formData.append('price', String(payload.price))

  if (payload.image) {
    formData.append('image', payload.image)
  }

  const { data } = await api.put<Product>(`/products/${payload.id}`, formData, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  return {
    ...data,
    price: Number(data.price),
  }
}

export async function deleteProduct(id: number): Promise<void> {
  const token = window.localStorage.getItem('avo_admin_token')
  await api.delete(`/products/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })
}

export async function listCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/products/categories')
  return data
}

export async function createCategory(name: string): Promise<Category> {
  const token = window.localStorage.getItem('avo_admin_token')
  const { data } = await api.post<Category>(
    '/products/categories',
    { name },
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    },
  )

  return data
}
