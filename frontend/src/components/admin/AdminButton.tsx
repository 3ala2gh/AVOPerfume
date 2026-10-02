import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { LoaderCircle, type LucideIcon } from 'lucide-react'
import { cn } from '../../utils/cn'
import { adminButtonClass, type AdminButtonSize, type AdminButtonVariant } from './adminStyles'

type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode
  variant?: AdminButtonVariant
  size?: AdminButtonSize
  icon?: LucideIcon
  isLoading?: boolean
}

export default function AdminButton({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  isLoading = false,
  disabled,
  className,
  type = 'button',
  ...props
}: AdminButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(adminButtonClass(variant, size), className)}
      {...props}
    >
      {isLoading ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : Icon ? (
        <Icon className="h-4 w-4" />
      ) : null}
      {children}
    </button>
  )
}
