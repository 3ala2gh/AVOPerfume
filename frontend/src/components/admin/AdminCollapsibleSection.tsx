import { useId, useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

type AdminCollapsibleSectionProps = {
  title: string
  description: string
  children: ReactNode
  defaultOpen?: boolean
  badge?: ReactNode
  className?: string
  contentClassName?: string
}

export default function AdminCollapsibleSection({
  title,
  description,
  children,
  defaultOpen = false,
  badge,
  className,
  contentClassName,
}: AdminCollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentId = useId()

  return (
    <section
      className={cn(
        'rounded-2xl border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,244,238,0.92))] shadow-[0_18px_48px_-28px_rgba(15,23,42,0.35)]',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5 sm:py-5 lg:px-6"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold tracking-[0.18em] text-black sm:text-lg">
              {title}
            </h2>
            {badge}
          </div>
          <p className="mt-1 text-sm text-black/55">{description}</p>
        </div>
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white/80 text-black transition-transform duration-300',
            isOpen && 'rotate-180',
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>

      <div
        id={contentId}
        className={cn(
          'grid overflow-hidden transition-all duration-300 ease-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className={cn('border-t border-black/8 px-4 py-4 sm:px-5 sm:py-5 lg:px-6', contentClassName)}>
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
