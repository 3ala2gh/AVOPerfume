import { X } from 'lucide-react'
import Button from '../common/ui/Button'
import { useCart } from '../../context/cart-context'

type CartDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, clearCart, openWhatsAppOrder } = useCart()

  return (
    <>
      <div
        className={`fixed inset-0 z-[70] bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <aside
        className={`fixed right-0 top-0 z-[80] h-full w-full max-w-[92vw] bg-white shadow-xl transition-transform duration-300 sm:max-w-md ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex h-full flex-col">
          <header className="flex items-center justify-between border-b border-black/10 px-4 py-4 sm:px-6">
            <h2 className="text-base font-semibold sm:text-lg">Your Cart</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-black/20 p-1.5 transition-colors hover:bg-black hover:text-white"
              aria-label="Close cart"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-6">
            {items.length === 0 ? (
              <p className="text-sm text-black/65">Your cart is empty.</p>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="flex items-center gap-2 rounded-lg border border-black/10 p-2.5 sm:gap-3 sm:p-3"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-14 w-14 shrink-0 rounded object-cover"
                      />
                    ) : (
                      <div className="h-14 w-14 shrink-0 rounded border border-dashed border-black/20 bg-black/[0.03]" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-black/65">{item.category}</p>
                      <p className="mt-1 text-sm text-black/80">
                        {item.price} JOD x {item.quantity}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="shrink-0 border border-black/20 px-2 py-1 text-xs transition-colors hover:bg-black hover:text-white sm:px-2.5"
                    >
                      Remove
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>

          <footer className="border-t border-black/10 px-3 py-3 pb-4 sm:px-6 sm:py-4">
            <div className="space-y-2">
              <Button
                type="button"
                onClick={openWhatsAppOrder}
                className="w-full"
              >
                Send Order On WhatsApp
              </Button>
              <Button
                type="button"
                onClick={clearCart}
                variant="outline"
                className="w-full"
              >
                Clear Cart
              </Button>
            </div>
          </footer>
        </div>
      </aside>
    </>
  )
}
