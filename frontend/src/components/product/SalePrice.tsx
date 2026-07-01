import { useI18n } from '../../hooks/useI18n'

export default function SalePrice({ price, originalPrice, className = '' }: { price: number; originalPrice?: number; className?: string }) {
  const { t } = useI18n()
  const onSale = originalPrice != null && originalPrice > price
  return (
    <span className={`inline-flex flex-wrap items-baseline gap-2 ${className}`}>
      {onSale ? <span className="text-black/50 line-through">{originalPrice.toFixed(3)} {t('common.jod')}</span> : null}
      <span>{price.toFixed(3)} {t('common.jod')}</span>
    </span>
  )
}
