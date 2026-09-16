import { ProductCard } from '../components/product/ProductCard'
import { useProductsQuery } from '../hooks/useProductsQuery'
import { useI18n } from '../hooks/useI18n'

function ProductsPage() {
  const { data: products = [], isLoading } = useProductsQuery()
  const { t } = useI18n()

  return (
    <main className="min-h-screen bg-ivory">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <header className="mb-12 text-center">
          <h1 className="font-display text-4xl font-light tracking-wide sm:text-5xl">
            {t('products.title')}
          </h1>
          <div className="mx-auto my-6 h-px w-20 bg-gradient-to-r from-transparent via-champagne to-transparent" />
          <p className="mx-auto max-w-lg text-sm font-light leading-relaxed text-ink-muted">
            {t('products.subtitle')}
          </p>
        </header>

        {isLoading && (
          <p className="text-center text-[11px] uppercase tracking-luxe text-ink-muted">
            {t('common.loadingProducts')}
          </p>
        )}

        <section className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3 lg:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </div>
    </main>
  )
}

export default ProductsPage
