import type { Product } from '../../types/product'
import SalePrice from './SalePrice'
import SaleBadge from './SaleBadge'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="card">
      <h2>{product.name}</h2>
      <p>{product.description ?? ''}</p>
      <SaleBadge discountPercent={product.discountPercent} className="inline-block" />
      <strong><SalePrice price={Number(product.price)} originalPrice={product.originalPrice == null ? undefined : Number(product.originalPrice)} /></strong>
    </article>
  )
}
