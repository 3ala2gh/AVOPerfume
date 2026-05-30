import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import type { Perfume } from '../components/home/catalogData'

type CartItem = {
  id: number
  name: string
  price: number
  category: string
  image: string
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  totalItems: number
  addToCart: (perfume: Perfume) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
  openWhatsAppOrder: () => void
}

const CART_STORAGE_KEY = 'avo_cart_items'
const WHATSAPP_NUMBER = '962799463217'

const CartContext = createContext<CartContextValue | null>(null)

function readInitialCart(): CartItem[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw) as CartItem[]
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed
  } catch {
    return []
  }
}

function buildWhatsAppMessage(items: CartItem[]): string {
  const lines = items.map(
    (item, index) =>
      `${index + 1}. ${item.name} (x${item.quantity}) - ${item.price} JOD`,
  )
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  return [
    'Hello AVO Perfume, I would like to order:',
    ...lines,
    '',
    `Total Amount: ${totalAmount.toFixed(2)} JOD`,
    '',
    'Thank you.',
  ].join('\n')
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readInitialCart)

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  function addToCart(perfume: Perfume) {
    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.id === perfume.id)
      if (!existing) {
        return [
          ...currentItems,
          {
            id: perfume.id,
            name: perfume.name,
            price: perfume.price,
            category: perfume.category,
            image: perfume.image,
            quantity: 1,
          },
        ]
      }

      return currentItems.map((item) =>
        item.id === perfume.id ? { ...item, quantity: item.quantity + 1 } : item,
      )
    })
    toast.success(`${perfume.name} added to cart`)
  }

  function removeFromCart(id: number) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  function clearCart() {
    setItems([])
  }

  function openWhatsAppOrder() {
    if (items.length === 0) {
      toast.error('Your cart is empty.')
      return
    }

    const message = buildWhatsAppMessage(items)
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    const openedWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer')

    if (!openedWindow) {
      toast.error('Could not open WhatsApp. Please allow popups and try again.')
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        addToCart,
        removeFromCart,
        clearCart,
        openWhatsAppOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export type { CartItem }
