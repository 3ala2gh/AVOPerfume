import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useI18n } from '../hooks/useI18n'
import { getOptimizedCloudinaryUrl } from '../utils/cloudinary'
import QuantityStepper from '../components/cart/QuantityStepper'

function CartPage() {
  const { items, changeQuantity, removeFromCart, clearCart, openWhatsAppOrder } = useCart()
  const { t, categoryLabel } = useI18n()

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t('cart.title')}</h1>
      <p className="mt-2 text-sm text-black/70 sm:text-base">
        {t('cart.subtitle')}
      </p>

      {items.length === 0 ? (
        <div className="mt-6 rounded-xl border border-black/10 bg-white p-6">
          <p className="text-black/70">{t('cart.empty')}</p>
          <Link
            to="/#products"
            className="mt-4 inline-block border border-black px-4 py-2 transition-colors hover:bg-black hover:text-white"
          >
            {t('cart.browse')}
          </Link>
        </div>
      ) : (
        <>
          <section className="mt-6 space-y-3">
            {items.map((item) => (
              <article
                key={item.key}
                className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3 sm:gap-4 sm:p-4"
              >
                {item.image ? (
                  <img
                    src={getOptimizedCloudinaryUrl(item.image, { width: 200 })}
                    alt={item.name}
                    className="h-16 w-16 shrink-0 rounded-md object-cover sm:h-20 sm:w-20"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="h-16 w-16 shrink-0 rounded-md border border-dashed border-black/20 bg-black/[0.03] sm:h-20 sm:w-20" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold sm:text-base">{item.name}</p>
                  <p className="text-xs text-black/60 sm:text-sm">
                    {categoryLabel(item.category, item.categoryAr)} - {item.size}
                  </p>
                  <p className="mt-1 text-sm font-medium text-black/80 sm:text-base">
                    {(item.price * item.quantity).toFixed(3)} {t('common.jod')}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <QuantityStepper
                      quantity={item.quantity}
                      itemName={item.name}
                      onDecrease={() => changeQuantity(item.key, -1)}
                      onIncrease={() => changeQuantity(item.key, 1)}
                    />
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.key)}
                      className="text-xs text-black/55 underline-offset-4 transition-colors hover:text-black hover:underline sm:text-sm"
                    >
                      {t('common.remove')}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={openWhatsAppOrder}
              className="w-full border border-black bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black sm:w-auto sm:text-base"
            >
              {t('cart.sendWhatsApp')}
            </button>
            <button
              type="button"
              onClick={clearCart}
              className="w-full border border-black/20 px-5 py-3 text-sm transition-colors hover:bg-black hover:text-white sm:w-auto sm:text-base"
            >
              {t('common.clearCart')}
            </button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-black/65 sm:text-sm">
            {t('cart.helper')}
          </p>
        </>
      )}
    </main>
  )
}

export default CartPage
