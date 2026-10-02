import { useState, type FormEvent } from 'react'
import { Check } from 'lucide-react'
import type { SizeSettings } from '../../api/admin.api'
import { useI18n } from '../../hooks/useI18n'
import { cn } from '../../utils/cn'
import AdminButton from './AdminButton'
import { AdminListSkeleton } from './AdminEmptyState'
import AdminPanel from './AdminPanel'

type Props = {
  settings: SizeSettings | undefined
  isLoading: boolean
  isSaving: boolean
  onSave: (settings: SizeSettings) => Promise<void>
}

const SIZE_FIELDS: { key: keyof SizeSettings; label: string }[] = [
  { key: 'is10MlEnabled', label: '10ml' },
  { key: 'is30MlEnabled', label: '30ml' },
  { key: 'is55MlEnabled', label: '55ml' },
  { key: 'is100MlEnabled', label: '100ml' },
]

export default function SizeAvailabilitySection({ settings, isLoading, isSaving, onSave }: Props) {
  const { t } = useI18n()
  const [draft, setDraft] = useState<SizeSettings>(
    settings ?? {
      is10MlEnabled: true,
      is30MlEnabled: true,
      is55MlEnabled: true,
      is100MlEnabled: true,
    },
  )
  const isDirty = settings ? SIZE_FIELDS.some(({ key }) => settings[key] !== draft[key]) : false

  async function submit(event: FormEvent) {
    event.preventDefault()
    await onSave(draft)
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl space-y-5">
      <AdminPanel title={t('admin.sizeAvailability')} description={t('admin.sizeAvailabilityDescription')}>
        {isLoading ? (
          <AdminListSkeleton rows={2} />
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {SIZE_FIELDS.map(({ key, label }) => {
              const isOn = draft[key]
              return (
                <button
                  key={key}
                  type="button"
                  role="switch"
                  aria-checked={isOn}
                  onClick={() => setDraft((current) => ({ ...current, [key]: !current[key] }))}
                  className={cn(
                    'flex flex-col items-start gap-3 rounded-xl border p-4 text-start transition-colors',
                    isOn ? 'border-champagne bg-champagne/[0.06]' : 'border-dashed border-ink/20 bg-ivory/60',
                  )}
                >
                  <span className={cn('text-xl font-semibold', isOn ? 'text-ink' : 'text-ink/35')}>{label}</span>
                  <span className="flex items-center gap-2 text-xs font-medium text-ink-muted">
                    <span
                      className={cn(
                        'relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors',
                        isOn ? 'bg-champagne' : 'bg-ink/15',
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all',
                          isOn ? 'start-[1.125rem]' : 'start-0.5',
                        )}
                      />
                    </span>
                    {isOn ? t('admin.sizeOn') : t('admin.sizeOff')}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </AdminPanel>

      <div className="flex justify-end">
        <AdminButton
          type="submit"
          icon={Check}
          isLoading={isSaving}
          disabled={isLoading || !isDirty}
          className="w-full sm:w-auto"
        >
          {isSaving ? t('admin.saving') : t('admin.saveChanges')}
        </AdminButton>
      </div>
    </form>
  )
}
