import type { Product } from '../../types/product'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="card">
      <h2>{product.name}</h2>
      <p>{product.description ?? 'No description available.'}</p>
      <strong>${Number(product.price).toFixed(2)}</strong>
    </article>
  )
}
