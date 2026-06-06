import type { Product } from '../../types/product'
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
      <strong>{Number(product.price).toFixed(2)} {t('common.jod')}</strong>
    </article>
  )
}
