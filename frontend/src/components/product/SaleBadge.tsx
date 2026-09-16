import { useI18n } from '../../hooks/useI18n'

interface SaleBadgeProps {
  discountPercent?: number | null
  className?: string
}

export default function SaleBadge({ discountPercent, className = '' }: SaleBadgeProps) {
  const { t } = useI18n()

  if (!discountPercent) return null

  return (
    <span
      className={`inline-block bg-champagne px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest text-white ${className}`}
    >
      {t('common.sale')} {discountPercent}%
    </span>
  )
}
