import { ProductCard } from '../components/product/ProductCard'
import { useProductsQuery } from '../hooks/useProductsQuery'
import { useI18n } from '../hooks/useI18n'

function ProductsPage() {
  const { data: products = [], isLoading } = useProductsQuery()
  const { t } = useI18n()

  return (
    <main className="container">
      <h1>{t('products.title')}</h1>
      <p className="lead">{t('products.subtitle')}</p>
      {isLoading && <p>{t('common.loadingProducts')}</p>}
      <section className="card-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </main>
  )
}

export default ProductsPage
