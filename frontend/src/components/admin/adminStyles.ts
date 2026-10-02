import { cn } from '../../utils/cn'

export type AdminButtonVariant = 'primary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'danger-outline'
export type AdminButtonSize = 'sm' | 'md'

const variantClasses: Record<AdminButtonVariant, string> = {
  primary: 'bg-ink text-white hover:bg-ink-soft',
  accent: 'bg-champagne text-white hover:bg-champagne-dark',
  outline: 'border border-ink/15 bg-white text-ink hover:border-ink/30 hover:bg-sand/60',
  ghost: 'text-ink-muted hover:bg-sand/70 hover:text-ink',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  'danger-outline': 'border border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50',
}

const sizeClasses: Record<AdminButtonSize, string> = {
  sm: 'h-9 gap-1.5 px-3 text-sm',
  md: 'h-11 gap-2 px-4 text-sm',
}

export function adminButtonClass(variant: AdminButtonVariant = 'primary', size: AdminButtonSize = 'md') {
  return cn(
    'inline-flex shrink-0 items-center justify-center rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
  )
}
