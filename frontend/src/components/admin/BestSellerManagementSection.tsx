import { useMemo, useState } from 'react'
import { Check, ChevronDown, ChevronUp, GripVertical, Plus, Search, Star, X } from 'lucide-react'
import type { Product } from '../../types/product'
import Input from '../common/ui/Input'
import { useI18n } from '../../hooks/useI18n'
import { getOptimizedCloudinaryUrl } from '../../utils/cloudinary'
import AdminButton from './AdminButton'
import AdminEmptyState, { AdminListSkeleton } from './AdminEmptyState'
import AdminPanel from './AdminPanel'

const MAX_BEST_SELLERS = 6

type Props = {
  products: Product[]
  isLoading: boolean
  isSaving: boolean
  onSave: (ids: number[]) => Promise<void>
}

export default function BestSellerManagementSection({
  products,
  isLoading,
  isSaving,
  onSave,
}: Props) {
  const { t } = useI18n()
  const [selectedIds, setSelectedIds] = useState<number[]>(() =>
    products
      .filter((product) => product.isBestSeller)
      .sort((a, b) => (a.bestSellerRank ?? 99) - (b.bestSellerRank ?? 99))
      .map((product) => product.id),
  )
  const [search, setSearch] = useState('')
  const [draggedId, setDraggedId] = useState<number | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const isFull = selectedIds.length >= MAX_BEST_SELLERS

  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  )
  const availableProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    return products.filter(
      (product) =>
        !selectedIds.includes(product.id) &&
        (!query || product.name.toLowerCase().includes(query)),
    )
  }, [products, search, selectedIds])

  function selectProduct(id: number) {
    if (isFull) return
    setSelectedIds((current) => [...current, id])
    setIsDirty(true)
  }

  function removeProduct(id: number) {
    setSelectedIds((current) => current.filter((item) => item !== id))
    setIsDirty(true)
  }

  function moveProduct(targetId: number) {
    if (draggedId === null || draggedId === targetId) return
    setSelectedIds((current) => {
      const next = current.filter((id) => id !== draggedId)
      next.splice(next.indexOf(targetId), 0, draggedId)
      return next
    })
    setDraggedId(null)
    setIsDirty(true)
  }

  function shiftProduct(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= selectedIds.length) return
    setSelectedIds((current) => {
      const next = [...current]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
    setIsDirty(true)
  }

  async function save() {
    await onSave(selectedIds)
    setIsDirty(false)
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        <AdminPanel
          title={t('admin.shownOnHomepage')}
          description={t('admin.dragToReorder')}
          actions={
            <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-white">
              <Star className="h-3.5 w-3.5 fill-champagne text-champagne" />
              {selectedIds.length}/{MAX_BEST_SELLERS}
            </span>
          }
        >
          {selectedIds.length === 0 ? (
            <AdminEmptyState icon={Star} title={t('admin.bestSellersEmpty')} />
          ) : (
            <ol className="space-y-2">
              {selectedIds.map((id, index) => {
                const product = productById.get(id)
                if (!product) return null
                return (
                  <li
                    key={id}
                    draggable
                    onDragStart={() => setDraggedId(id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => moveProduct(id)}
                    className="flex items-center gap-2 rounded-xl border border-ink/[0.08] bg-white p-2 sm:cursor-grab sm:gap-3 sm:p-2.5 sm:active:cursor-grabbing"
                  >
                    <GripVertical className="hidden h-4 w-4 shrink-0 text-ink/30 sm:block" />
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-champagne/15 text-xs font-bold text-champagne-dark">
                      {index + 1}
                    </span>
                    {product.imageUrl ? (
                      <img
                        src={getOptimizedCloudinaryUrl(product.imageUrl, { width: 120 })}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-lg border border-ink/10 object-contain"
                      />
                    ) : null}
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{product.name}</span>
                    <span className="flex shrink-0 items-center">
                      <button
                        type="button"
                        onClick={() => shiftProduct(index, -1)}
                        disabled={index === 0}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-ink/50 hover:bg-sand hover:text-ink disabled:opacity-25"
                        aria-label={t('admin.moveUp')}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => shiftProduct(index, 1)}
                        disabled={index === selectedIds.length - 1}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-ink/50 hover:bg-sand hover:text-ink disabled:opacity-25"
                        aria-label={t('admin.moveDown')}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeProduct(id)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-ink/50 hover:bg-red-50 hover:text-red-600"
                        aria-label={t('admin.removeNamed', { name: product.name })}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  </li>
                )
              })}
            </ol>
          )}
        </AdminPanel>

        <AdminPanel
          title={t('admin.addPerfumes')}
          description={isFull ? t('admin.limitReached') : undefined}
        >
          <div className="relative">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('admin.searchToAdd')}
              aria-label={t('admin.searchToAdd')}
              className="ps-10"
            />
          </div>
          <div className="mt-3 max-h-96 overflow-y-auto">
            {isLoading ? (
              <AdminListSkeleton rows={4} />
            ) : availableProducts.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink-muted">{t('admin.noAvailablePerfumes')}</p>
            ) : (
              <ul className="space-y-1">
                {availableProducts.map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      disabled={isFull}
                      onClick={() => selectProduct(product.id)}
                      className="group flex w-full items-center gap-3 rounded-lg p-2 text-start text-sm transition-colors hover:bg-sand/50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {product.imageUrl ? (
                        <img
                          src={getOptimizedCloudinaryUrl(product.imageUrl, { width: 120 })}
                          alt=""
                          loading="lazy"
                          className="h-9 w-9 shrink-0 rounded-md border border-ink/10 object-contain"
                        />
                      ) : (
                        <span className="h-9 w-9 shrink-0 rounded-md bg-ivory" />
                      )}
                      <span className="min-w-0 flex-1 truncate font-medium text-ink">{product.name}</span>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink/60 transition-colors group-hover:border-champagne group-hover:bg-champagne group-hover:text-white">
                        <Plus className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </AdminPanel>
      </div>

      <div className="flex justify-end">
        <AdminButton icon={Check} onClick={() => void save()} isLoading={isSaving} disabled={!isDirty} className="w-full sm:w-auto">
          {isSaving ? t('admin.saving') : t('admin.saveBestSellers')}
        </AdminButton>
      </div>
    </div>
  )
}
