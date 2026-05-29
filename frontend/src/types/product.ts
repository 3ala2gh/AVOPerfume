export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  category: string
  imageUrl: string | null
  createdAt?: string
}

export interface CreateProductInput {
  name: string
  description: string
  categoryId: number
  price: number
  image: File
}

export interface Category {
  id: number
  name: string
  createdAt?: string
}
