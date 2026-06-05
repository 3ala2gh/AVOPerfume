import { Link } from 'react-router-dom'
import { useCart } from '../context/cart-context'
import { useI18n } from '../i18n'

function CartPage() {
  const { items, removeFromCart, clearCart, openWhatsAppOrder } = useCart()
  const { t } = useI18n()

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
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 shrink-0 rounded-md object-cover sm:h-20 sm:w-20"
                  />
                ) : (
                  <div className="h-16 w-16 shrink-0 rounded-md border border-dashed border-black/20 bg-black/[0.03] sm:h-20 sm:w-20" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold sm:text-base">{item.name}</p>
                  <p className="text-xs text-black/60 sm:text-sm">{item.category} - {item.size}</p>
                  <p className="mt-1 text-sm text-black/80 sm:text-base">
                    {t('cart.itemPrice', { price: item.price, quantity: item.quantity })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.key)}
                  className="border border-black/20 px-3 py-1.5 text-xs transition-colors hover:bg-black hover:text-white sm:text-sm"
                >
                  {t('common.remove')}
                </button>
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
