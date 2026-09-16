import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../../utils/cn'

type ButtonVariant = 'primary' | 'outline' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-ink text-white hover:bg-champagne disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-ink',
  outline:
    'border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-white disabled:opacity-60 disabled:cursor-not-allowed',
  danger:
    'border border-red-300 text-red-700 hover:bg-red-600 hover:border-red-600 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed',
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
        'rounded-md px-4 py-2.5 text-sm tracking-wide transition-all duration-300 ease-luxe',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
