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
        'w-full rounded-md border border-black/20 px-3 py-2.5 text-sm outline-none focus:border-black sm:text-base',
        className,
      )}
      {...props}
    />
  )
})

export default Input
