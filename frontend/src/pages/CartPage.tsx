import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useI18n } from '../hooks/useI18n'
import { getOptimizedCloudinaryUrl } from '../utils/cloudinary'
import QuantityStepper from '../components/cart/QuantityStepper'

function CartPage() {
  const { items, changeQuantity, removeFromCart, clearCart, openWhatsAppOrder } = useCart()
  const { t, categoryLabel } = useI18n()

  return (
    <main className="min-h-screen bg-ivory">
      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <header className="mb-10 border-b border-ink/10 pb-6">
          <h1 className="font-display text-4xl font-light tracking-wide">{t('cart.title')}</h1>
          <p className="mt-3 text-sm font-light text-ink-muted">{t('cart.subtitle')}</p>
        </header>

        {items.length === 0 ? (
          <div className="border border-ink/10 bg-white px-4 py-16 text-center">
            <p className="font-display text-xl font-light text-ink-muted">{t('cart.empty')}</p>
            <Link
              to="/shop"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-6 inline-block border border-ink/20 px-8 py-3.5 text-[11px] font-medium uppercase tracking-luxe text-ink no-underline transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white"
            >
              {t('cart.browse')}
            </Link>
          </div>
        ) : (
          <>
            <section className="space-y-5">
              {items.map((item) => (
                <article
                  key={item.key}
                  className="flex items-start gap-4 border-b border-ink/10 pb-5 sm:gap-6"
                >
                  {item.image ? (
                    <img
                      src={getOptimizedCloudinaryUrl(item.image, { width: 200 })}
                      alt={item.name}
                      className="h-24 w-20 shrink-0 bg-sand object-cover sm:h-28 sm:w-24"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="h-24 w-20 shrink-0 border border-dashed border-ink/15 bg-sand sm:h-28 sm:w-24" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg tracking-wide sm:text-xl">
                      {item.name}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-widest text-ink-muted">
                      {categoryLabel(item.category, item.categoryAr)} · {item.size}
                    </p>
                    <p className="mt-2 text-sm font-light tracking-wide sm:text-base">
                      {(item.price * item.quantity).toFixed(3)} {t('common.jod')}
                    </p>
                    <div className="mt-4 flex items-center gap-4">
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
            </section>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openWhatsAppOrder}
                className="w-full bg-ink px-8 py-4 text-[11px] font-medium uppercase tracking-luxe text-white transition-colors duration-500 hover:bg-champagne sm:w-auto"
              >
                {t('cart.sendWhatsApp')}
              </button>
              <button
                type="button"
                onClick={clearCart}
                className="w-full border border-ink/20 px-8 py-4 text-[10px] font-medium uppercase tracking-luxe text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white sm:w-auto"
              >
                {t('common.clearCart')}
              </button>
            </div>
            <p className="mt-5 text-xs font-light leading-relaxed text-ink-muted">
              {t('cart.helper')}
            </p>
          </>
        )}
      </div>
    </main>
  )
}

export default CartPage
