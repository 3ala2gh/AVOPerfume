import type { Product } from '../../types/product'
import SalePrice from './SalePrice'
import SaleBadge from './SaleBadge'
import { getOptimizedCloudinaryUrl } from '../../utils/cloudinary'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group text-start">
      <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-sand">
        <SaleBadge
          discountPercent={product.discountPercent}
          className="absolute bottom-4 left-4 z-10"
        />
        {product.imageUrl ? (
          <img
            src={getOptimizedCloudinaryUrl(product.imageUrl, { width: 600 })}
            alt={product.name}
            className="h-full w-full object-contain p-4 transition-transform duration-[900ms] ease-luxe group-hover:scale-[1.06] sm:p-6"
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>
      <p className="text-[10px] uppercase tracking-widest text-ink-muted">{product.category}</p>
      <h2 className="mt-1.5 line-clamp-1 font-display text-lg font-normal tracking-wide">
        {product.name}
      </h2>
      <p className="mt-1.5 line-clamp-2 text-xs font-light leading-relaxed text-ink-muted">
        {product.description ?? ''}
      </p>
      <div className="mt-2.5">
        <SalePrice
          price={Number(product.price)}
          originalPrice={
            product.originalPrice == null ? undefined : Number(product.originalPrice)
          }
          className="text-sm"
        />
      </div>
    </article>
  )
}
