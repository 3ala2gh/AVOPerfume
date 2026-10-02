import { useMemo, useState, type FormEvent } from 'react'
import { Check, Percent, Search } from 'lucide-react'
import type { Product } from '../../types/product'
import Input from '../common/ui/Input'
import { useI18n } from '../../hooks/useI18n'
import { cn } from '../../utils/cn'
import AdminButton from './AdminButton'
import { AdminListSkeleton } from './AdminEmptyState'
import AdminPanel from './AdminPanel'

type Props = { products: Product[]; isLoading: boolean; isSaving: boolean; onSave: (percentage: number, all: boolean, ids: number[]) => Promise<void> }

export default function DiscountManagementSection({ products, isLoading, isSaving, onSave }: Props) {
  const { t } = useI18n()
  const [discount, setDiscount] = useState('')
  const [applyToAll, setApplyToAll] = useState(true)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [search, setSearch] = useState('')
  const visible = useMemo(() => products.filter((product) => product.name.toLowerCase().includes(search.trim().toLowerCase())), [products, search])
  const canSave = discount !== '' && (applyToAll || selectedIds.length > 0)

  async function submit(event: FormEvent) {
    event.preventDefault()
    const percentage = Number(discount)
    if (percentage < 0 || percentage > 100 || (!applyToAll && !selectedIds.length)) return
    await onSave(percentage, applyToAll, selectedIds)
  }

  function toggleProduct(id: number) {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]))
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl space-y-5">
      <AdminPanel step={1} title={t('admin.discountPercent')} description={t('admin.discountHint')}>
          <div className="relative max-w-xs">
            <Input
              id="discount-percent"
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              step="0.01"
              required
              value={discount}
              onChange={(event) => setDiscount(event.target.value)}
              placeholder="25"
              aria-label={t('admin.discountPercent')}
              className="pe-10 text-lg font-semibold"
            />
            <Percent className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          </div>
      </AdminPanel>

      <AdminPanel step={2} title={t('admin.applyTo')}>
        <div role="radiogroup" className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
          {[
            { value: true, label: t('admin.allPerfumes'), hint: t('admin.perfumeCount', { count: products.length }) },
            { value: false, label: t('admin.selectedPerfumes'), hint: t('admin.selectedCount', { count: selectedIds.length }) },
          ].map((option) => {
            const isActive = applyToAll === option.value
            return (
              <button
                key={String(option.value)}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => setApplyToAll(option.value)}
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-3.5 text-start transition-colors',
                  isActive ? 'border-champagne bg-champagne/[0.06]' : 'border-ink/10 bg-white hover:border-ink/25',
                )}
              >
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                    isActive ? 'border-champagne' : 'border-ink/25',
                  )}
                >
                  {isActive ? <span className="h-2.5 w-2.5 rounded-full bg-champagne" /> : null}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">{option.label}</span>
                  <span className="block text-xs text-ink-muted">{option.hint}</span>
                </span>
              </button>
            )
          })}
        </div>

        {!applyToAll ? (
          <div className="mt-4 space-y-2">
            <div className="relative">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('admin.searchPerfumes')}
                aria-label={t('admin.searchPerfumes')}
                className="ps-10"
              />
            </div>
            <div className="max-h-80 overflow-y-auto rounded-xl border border-ink/10 bg-white p-1.5">
              {isLoading ? (
                <AdminListSkeleton rows={4} />
              ) : (
                visible.map((product) => {
                  const isSelected = selectedIds.includes(product.id)
                  return (
                    <label
                      key={product.id}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm transition-colors',
                        isSelected ? 'bg-champagne/[0.08]' : 'hover:bg-sand/50',
                      )}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isSelected}
                        onChange={() => toggleProduct(product.id)}
                      />
                      <span
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors',
                          isSelected ? 'border-champagne bg-champagne text-white' : 'border-ink/25 bg-white',
                        )}
                      >
                        {isSelected ? <Check className="h-3.5 w-3.5" /> : null}
                      </span>
                      <span className="min-w-0 flex-1 truncate font-medium text-ink">{product.name}</span>
                      {product.discountPercent ? (
                        <span className="shrink-0 rounded-full bg-champagne/15 px-2 py-0.5 text-[11px] font-semibold text-champagne-dark">
                          {t('admin.percentOff', { value: product.discountPercent })}
                        </span>
                      ) : null}
                    </label>
                  )
                })
              )}
            </div>
          </div>
        ) : null}
      </AdminPanel>

      <div className="flex justify-end">
        <AdminButton type="submit" icon={Check} isLoading={isSaving} disabled={!canSave} className="w-full sm:w-auto">
          {isSaving ? t('admin.saving') : t('admin.saveDiscount')}
        </AdminButton>
      </div>
    </form>
  )
}
