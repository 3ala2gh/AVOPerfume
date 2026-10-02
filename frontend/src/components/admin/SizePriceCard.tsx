import type { InputHTMLAttributes, Ref } from 'react'
import { CircleAlert } from 'lucide-react'
import Input from '../common/ui/Input'
import { useI18n } from '../../hooks/useI18n'
import { cn } from '../../utils/cn'
import AdminSwitch from './AdminSwitch'

type SizePriceCardProps = {
  id: string
  size: string
  enabled: boolean
  onEnabledChange: (enabled: boolean) => void
  inputProps: InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> }
  error?: string
}

export default function SizePriceCard({
  id,
  size,
  enabled,
  onEnabledChange,
  inputProps,
  error,
}: SizePriceCardProps) {
  const { t } = useI18n()

  return (
    <div
      className={cn(
        'space-y-3 rounded-xl border p-3.5 transition-colors',
        enabled ? 'border-ink/10 bg-white' : 'border-dashed border-ink/15 bg-ivory/70',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className={cn('text-sm font-semibold', enabled ? 'text-ink' : 'text-ink/40')}>
          {size}
        </label>
        <AdminSwitch
          checked={enabled}
          onChange={onEnabledChange}
          label={enabled ? t('admin.sizeOn') : t('admin.sizeOff')}
        />
      </div>
      <div className="relative">
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          min="0.01"
          step="0.01"
          aria-invalid={Boolean(error)}
          className={cn('pe-14', !enabled && 'text-ink/40')}
          {...inputProps}
        />
        <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-xs font-medium text-ink/40">
          {t('common.jod')}
        </span>
      </div>
      {error ? (
        <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
          <CircleAlert className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  )
}
