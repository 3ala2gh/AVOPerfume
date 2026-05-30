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
        'w-full rounded-md border border-black/20 px-3 py-2.5 text-sm outline-none focus:border-black sm:text-base',
        className,
      )}
      {...props}
    />
  )
})

export default Select
