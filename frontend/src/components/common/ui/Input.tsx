import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../../utils/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-md border border-ink/15 bg-white px-3 py-2.5 text-sm font-light tracking-wide outline-none transition-colors duration-300 focus:border-champagne sm:text-base',
        className,
      )}
      {...props}
    />
  )
})

export default Input
