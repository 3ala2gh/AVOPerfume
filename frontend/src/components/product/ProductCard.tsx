import type { Product } from '../../types/product'
import SalePrice from './SalePrice'
import { useI18n } from '../../hooks/useI18n'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useI18n()

  return (
    <article className="card">
      <h2>{product.name}</h2>
      <p>{product.description ?? ''}</p>
      {product.discountPercent ? <span className="inline-block rounded-full bg-black px-3 py-1 text-xs text-white">{t('common.sale')}</span> : null}
      <strong><SalePrice price={Number(product.price)} originalPrice={product.originalPrice == null ? undefined : Number(product.originalPrice)} /></strong>
    </article>
  )
}
