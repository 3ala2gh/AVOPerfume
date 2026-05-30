export interface Product {
  id: number
  name: string
  description: string | null
  gender: 'male' | 'female' | 'unisex'
  price: number
  categoryId: number
  category: string
  imageUrl: string | null
  createdAt?: string
}

export interface Offer {
  id: number
  imageUrl: string
  createdAt?: string
}

export interface CreateProductInput {
  name: string
  description: string
  gender: 'male' | 'female' | 'unisex'
  categoryId: number
  price: number
  image: File
}

export interface UpdateProductInput {
  id: number
  name: string
  description: string
  gender: 'male' | 'female' | 'unisex'
  categoryId: number
  price: number
  image?: File
}

export interface Category {
  id: number
  name: string
  createdAt?: string
}
