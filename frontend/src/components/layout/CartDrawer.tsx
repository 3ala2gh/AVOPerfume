import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useCart } from '../../hooks/useCart'
import { useI18n } from '../../hooks/useI18n'
import { getOptimizedCloudinaryUrl } from '../../utils/cloudinary'
import QuantityStepper from '../cart/QuantityStepper'
import { DELIVERY_FEE_JOD } from '../../config/cart'

type CartDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, changeQuantity, removeFromCart, clearCart, openWhatsAppOrder } = useCart()
  const { t, categoryLabel } = useI18n()
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )
  const total = subtotal + DELIVERY_FEE_JOD

  // Rendered via portal: the navbar's backdrop-blur makes it a containing
  // block for fixed-position descendants, which would otherwise confine
  // this drawer's height/position to the navbar's own small box.
  return createPortal(
    <>
      <div
        className={`fixed inset-0 z-[70] bg-ink/50 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <aside
        className={`fixed right-0 top-0 z-[80] h-full w-full max-w-[92vw] bg-ivory shadow-lift transition-transform duration-500 ease-luxe sm:max-w-md ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex h-full flex-col">
          <header className="flex items-center justify-between border-b border-ink/10 px-5 py-5 sm:px-6">
            <h2 className="font-display text-xl font-normal tracking-wide">
              {t('cart.title')}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink transition-all duration-300 hover:border-champagne hover:bg-champagne hover:text-white"
              aria-label={t('common.closeCart')}
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            {items.length === 0 ? (
              <p className="py-10 text-center text-sm font-light text-ink-muted">
                {t('cart.empty')}
              </p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <article key={item.key} className="flex items-start gap-3 border-b border-ink/5 pb-4">
                    {item.image ? (
                      <img
                        src={getOptimizedCloudinaryUrl(item.image, { width: 160 })}
                        alt={item.name}
                        className="h-20 w-16 shrink-0 bg-sand object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="h-20 w-16 shrink-0 border border-dashed border-ink/15 bg-sand" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-base tracking-wide">{item.name}</p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-widest text-ink-muted">
                        {categoryLabel(item.category, item.categoryAr)} · {item.size}
                      </p>
                      <p className="mt-1.5 text-sm font-light tracking-wide">
                        {(item.price * item.quantity).toFixed(3)} {t('common.jod')}
                      </p>
                      <div className="mt-3 flex items-center gap-4">
                        <QuantityStepper
                          quantity={item.quantity}
                          itemName={item.name}
                          onDecrease={() => changeQuantity(item.key, -1)}
                          onIncrease={() => changeQuantity(item.key, 1)}
                        />
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.key)}
                          className="text-[10px] uppercase tracking-widest text-ink-muted transition-colors hover:text-champagne"
                        >
                          {t('common.remove')}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <footer className="border-t border-ink/10 px-5 py-5 sm:px-6">
            {items.length > 0 && (
              <div className="mb-5 space-y-2.5 text-sm font-light">
                <div className="flex items-center justify-between text-ink-muted">
                  <span>{t('cart.subtotal')}</span>
                  <span>{subtotal.toFixed(2)} {t('common.jod')}</span>
                </div>
                <div className="flex items-center justify-between text-ink-muted">
                  <span>{t('cart.delivery')}</span>
                  <span>{DELIVERY_FEE_JOD.toFixed(2)} {t('common.jod')}</span>
                </div>
                <div className="flex items-center justify-between border-t border-ink/10 pt-3 text-base">
                  <span className="text-[10px] uppercase tracking-widest text-ink-muted">
                    {t('cart.total')}
                  </span>
                  <span className="font-display text-xl">
                    {total.toFixed(2)} {t('common.jod')}
                  </span>
                </div>
              </div>
            )}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={openWhatsAppOrder}
                className="w-full bg-ink py-4 text-[11px] font-medium uppercase tracking-luxe text-white transition-colors duration-500 hover:bg-champagne"
              >
                {t('cart.sendWhatsApp')}
              </button>
              <button
                type="button"
                onClick={clearCart}
                className="w-full border border-ink/20 py-3.5 text-[10px] font-medium uppercase tracking-luxe text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white"
              >
                {t('common.clearCart')}
              </button>
            </div>
          </footer>
        </div>
      </aside>
    </>,
    document.body,
  )
}
