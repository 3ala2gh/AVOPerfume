import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '../../../utils/cn'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cn(
        'w-full rounded-md border border-ink/15 bg-white px-3 py-2.5 text-sm font-light tracking-wide outline-none transition-colors duration-300 focus:border-champagne sm:text-base',
        className,
      )}
      {...props}
    />
  )
})

export default Select
