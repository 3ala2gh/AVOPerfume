import { useEffect, useState } from 'react'
import { ProductCard } from '../components/product/ProductCard'
import { listProducts } from '../api/products.api'
import type { Product } from '../types/product'

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    listProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
  }, [])

  return (
    <main className="container">
      <h1>Products</h1>
      <p className="lead">Starter data is currently served from the backend module.</p>
      <section className="card-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </main>
  )
}

export default ProductsPage
