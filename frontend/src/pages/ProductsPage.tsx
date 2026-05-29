import { ProductCard } from '../components/product/ProductCard'
import { useProductsQuery } from '../hooks/useProductsQuery'

function ProductsPage() {
  const { data: products = [], isLoading } = useProductsQuery()

  return (
    <main className="container">
      <h1>Products</h1>
      <p className="lead">Products are loaded from your database.</p>
      {isLoading && <p>Loading products...</p>}
      <section className="card-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </main>
  )
}

export default ProductsPage
