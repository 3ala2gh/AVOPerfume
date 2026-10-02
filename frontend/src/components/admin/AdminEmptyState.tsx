import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type AdminEmptyStateProps = {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export default function AdminEmptyState({ icon: Icon, title, description, action }: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink/15 bg-ivory/60 px-6 py-10 text-center">
      <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-champagne/15 text-champagne-dark">
        <Icon className="h-5 w-5" />
      </span>
      <p className="text-sm font-semibold text-ink">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

export function AdminListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="h-14 animate-shimmer rounded-xl bg-[linear-gradient(90deg,rgba(11,11,12,0.04),rgba(11,11,12,0.08),rgba(11,11,12,0.04))] bg-[length:200%_100%]"
        />
      ))}
    </div>
  )
}
