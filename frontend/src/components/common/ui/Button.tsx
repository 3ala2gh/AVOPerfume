import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../../utils/cn'

type ButtonVariant = 'primary' | 'outline' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-black text-white hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed',
  outline:
    'border border-black/20 text-black hover:bg-black hover:text-white disabled:opacity-70 disabled:cursor-not-allowed',
  danger:
    'border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-70 disabled:cursor-not-allowed',
}

export default function Button({
  children,
  className,
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'rounded-md px-4 py-2.5 text-sm transition-colors sm:text-base',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
