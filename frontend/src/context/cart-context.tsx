import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import {
  DEFAULT_PERFUME_SIZE,
  getPerfumeSizePrice,
  type Perfume,
} from '../components/home/catalogData'
import type { PerfumeSize } from '../types/product'
import { useI18n } from '../hooks/useI18n'
import { CartContext, type CartItem } from './cart'
import { WHATSAPP_URL } from '../config/contact'

const CART_STORAGE_KEY = 'avo_cart_items'

function readInitialCart(): CartItem[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw) as Array<
      CartItem | Omit<CartItem, 'key' | 'size' | 'categoryAr'>
    >
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.map((item) => {
      const size = 'size' in item ? item.size : DEFAULT_PERFUME_SIZE
      return {
        ...item,
        size,
        categoryAr: 'categoryAr' in item ? item.categoryAr : item.category,
        key: 'key' in item ? item.key : `${item.id}-${size}`,
      }
    })
  } catch {
    return []
  }
}

function buildWhatsAppMessage(
  items: CartItem[],
  t: (key: string, values?: Record<string, string | number>) => string,
): string {
  const lines = items.map(
    (item, index) =>
      `${index + 1}. ${item.name} - ${item.size} (x${item.quantity}) - ${item.price} ${t('common.jod')}`,
  )
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  return [
    t('cart.whatsappGreeting'),
    ...lines,
    '',
    t('cart.whatsappTotal', { total: totalAmount.toFixed(2) }),
    '',
    t('cart.whatsappThanks'),
  ].join('\n')
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n()
  const [items, setItems] = useState<CartItem[]>(readInitialCart)

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  function addToCart(perfume: Perfume, size: PerfumeSize = DEFAULT_PERFUME_SIZE) {
    const key = `${perfume.id}-${size}`
    const price = getPerfumeSizePrice(perfume, size)

    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.key === key)
      if (!existing) {
        return [
          ...currentItems,
          {
            key,
            id: perfume.id,
            name: perfume.name,
            price,
            size,
            category: perfume.category,
            categoryAr: perfume.categoryAr,
            image: perfume.image,
            quantity: 1,
          },
        ]
      }

      return currentItems.map((item) =>
        item.key === key ? { ...item, quantity: item.quantity + 1 } : item,
      )
    })
    toast.success(t('cart.added', { name: perfume.name, size }))
  }

  function removeFromCart(key: string) {
    setItems((currentItems) => currentItems.filter((item) => item.key !== key))
  }

  function clearCart() {
    setItems([])
  }

  function openWhatsAppOrder() {
    if (items.length === 0) {
      toast.error(t('cart.empty'))
      return
    }

    const message = buildWhatsAppMessage(items, t)
    const whatsappUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
    const openedWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer')

    if (!openedWindow) {
      toast.error(t('cart.whatsappError'))
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
