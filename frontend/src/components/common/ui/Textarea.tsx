import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../../utils/cn'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-md border border-black/20 px-3 py-2.5 text-sm outline-none focus:border-black sm:text-base',
        className,
      )}
      {...props}
    />
  )
})

export default Textarea
