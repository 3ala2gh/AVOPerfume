import { useI18n } from '../../hooks/useI18n'

interface SaleBadgeProps {
  discountPercent?: number | null
  className?: string
}

export default function SaleBadge({ discountPercent, className = '' }: SaleBadgeProps) {
  const { t } = useI18n()

  if (!discountPercent) return null

  return (
    <span className={`rounded-full bg-black px-3 py-1 text-xs text-white ${className}`}>
      {t('common.sale')} {discountPercent}%
    </span>
  )
}
