import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

type AdminPanelProps = {
  title?: string
  description?: string
  step?: number
  actions?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
  /** Drop the body padding, e.g. for edge-to-edge lists. */
  flush?: boolean
}

export default function AdminPanel({
  title,
  description,
  step,
  actions,
  children,
  className,
  bodyClassName,
  flush = false,
}: AdminPanelProps) {
  const hasHeader = Boolean(title || description || actions)

  return (
    <section
      className={cn(
        'rounded-2xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(11,11,12,0.04)]',
        className,
      )}
    >
      {hasHeader ? (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-ink/[0.06] px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            {step ? (
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-champagne/15 text-xs font-semibold text-champagne-dark">
                {step}
              </span>
            ) : null}
            <div className="min-w-0">
              {title ? (
                <h2 className="text-base font-semibold text-ink">{title}</h2>
              ) : null}
              {description ? (
                <p className="mt-0.5 text-sm text-ink-muted">{description}</p>
              ) : null}
            </div>
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      <div className={cn(!flush && 'px-5 py-5 sm:px-6', bodyClassName)}>{children}</div>
    </section>
  )
}
