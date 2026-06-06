export type PerfumeSize = '10ml' | '30ml' | '55ml' | '100ml'

export interface ProductSizePrice {
  size: PerfumeSize
  price: number
}

export interface Product {
  id: number
  name: string
  description: string | null
  gender: 'male' | 'female' | 'unisex'
  price: number
  price10Ml: number
  price30Ml: number
  price55Ml: number
  price100Ml: number
  sizes: ProductSizePrice[]
  categoryId: number
  category: string
  categoryAr: string
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
  price10Ml: number
  price30Ml: number
  price55Ml: number
  price100Ml: number
  image: File
}

export interface UpdateProductInput {
  id: number
  name: string
  description: string
  gender: 'male' | 'female' | 'unisex'
  categoryId: number
  price: number
  price10Ml: number
  price30Ml: number
  price55Ml: number
  price100Ml: number
  image?: File
}

export interface Category {
  id: number
  name: string
  nameAr: string
  createdAt?: string
}

export type CategoryInput = {
  name: string
  nameAr: string
}
