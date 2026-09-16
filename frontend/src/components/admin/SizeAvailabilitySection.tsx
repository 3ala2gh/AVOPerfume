import { useState, type FormEvent } from 'react'
import type { SizeSettings } from '../../api/admin.api'
import { useI18n } from '../../hooks/useI18n'
import AdminCollapsibleSection from './AdminCollapsibleSection'

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

  async function submit(event: FormEvent) {
    event.preventDefault()
    await onSave(draft)
  }

  return (
    <AdminCollapsibleSection
      title={t('admin.sizeAvailability')}
      description={t('admin.sizeAvailabilityDescription')}
    >
      <form onSubmit={submit} className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-black/60">{t('admin.loadingPerfumes')}</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SIZE_FIELDS.map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 rounded-md border border-black/10 p-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={draft[key]}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, [key]: event.target.checked }))
                  }
                />
                {label}
              </label>
            ))}
          </div>
        )}
        <button
          type="submit"
          disabled={isSaving || isLoading}
          className="rounded-md bg-black px-4 py-2.5 text-sm text-white disabled:opacity-50"
        >
          {isSaving ? t('admin.saving') : t('admin.saveChanges')}
        </button>
      </form>
    </AdminCollapsibleSection>
  )
}
