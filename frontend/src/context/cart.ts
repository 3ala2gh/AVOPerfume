import { createContext } from 'react'
import type { Perfume } from '../components/home/catalogData'
import type { PerfumeSize } from '../types/product'

export type CartItem = {
  key: string
  id: number
  name: string
  price: number
  size: PerfumeSize
  category: string
  categoryAr: string
  image: string
  quantity: number
}

export type CartContextValue = {
  items: CartItem[]
  totalItems: number
  addToCart: (perfume: Perfume, size?: PerfumeSize) => void
  removeFromCart: (key: string) => void
  clearCart: () => void
  openWhatsAppOrder: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)
