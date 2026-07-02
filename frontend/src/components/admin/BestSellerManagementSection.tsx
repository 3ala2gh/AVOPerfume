import { useMemo, useState } from 'react'
import { Check, GripVertical, Search, Star, X } from 'lucide-react'
import type { Product } from '../../types/product'
import Input from '../common/ui/Input'
import AdminCollapsibleSection from './AdminCollapsibleSection'

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
  const [selectedIds, setSelectedIds] = useState<number[]>(() =>
    products
      .filter((product) => product.isBestSeller)
      .sort((a, b) => (a.bestSellerRank ?? 99) - (b.bestSellerRank ?? 99))
      .map((product) => product.id),
  )
  const [search, setSearch] = useState('')
  const [draggedId, setDraggedId] = useState<number | null>(null)
  const [isDirty, setIsDirty] = useState(false)

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
    if (selectedIds.length >= MAX_BEST_SELLERS) return
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

  async function save() {
    await onSave(selectedIds)
    setIsDirty(false)
  }

  return (
    <AdminCollapsibleSection
      title="Best Sellers"
      description={`Choose and order up to ${MAX_BEST_SELLERS} homepage products.`}
      badge={
        <span className="inline-flex items-center gap-1 rounded-full bg-black px-2.5 py-1 text-[11px] font-medium text-white">
          <Star className="h-3.5 w-3.5 fill-white" />
          {selectedIds.length}/{MAX_BEST_SELLERS}
        </span>
      }
    >
      <div className="space-y-2">
        {selectedIds.length === 0 ? (
          <div className="rounded-lg border border-dashed border-black/20 px-4 py-6 text-center text-sm text-black/50">
            Select products below to build the collection.
          </div>
        ) : (
          selectedIds.map((id, index) => {
            const product = productById.get(id)
            if (!product) return null
            return (
              <div
                key={id}
                draggable
                onDragStart={() => setDraggedId(id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => moveProduct(id)}
                className="flex cursor-grab items-center gap-3 rounded-lg border border-black/10 bg-white p-2.5 shadow-sm active:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4 shrink-0 text-black/35" />
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                  {index + 1}
                </span>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt="" className="h-10 w-10 rounded object-cover" />
                ) : null}
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{product.name}</span>
                <button
                  type="button"
                  onClick={() => removeProduct(id)}
                  className="rounded-full p-1.5 text-black/50 transition-colors hover:bg-black hover:text-white"
                  aria-label={`Remove ${product.name} from best sellers`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )
          })
        )}
      </div>

      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search perfumes to add..." className="pl-9" />
      </div>
      <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-black/10 bg-white/80 p-1">
        {isLoading ? (
          <p className="p-3 text-sm text-black/50">Loading...</p>
        ) : availableProducts.length === 0 ? (
          <p className="p-3 text-sm text-black/50">No available perfumes.</p>
        ) : (
          availableProducts.map((product) => (
            <button
              key={product.id}
              type="button"
              disabled={selectedIds.length >= MAX_BEST_SELLERS}
              onClick={() => selectProduct(product.id)}
              className="flex w-full items-center gap-3 rounded-md p-2 text-left text-sm transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-black/15">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span className="truncate">{product.name}</span>
            </button>
          ))
        )}
      </div>

      <button
        type="button"
        onClick={save}
        disabled={isSaving || !isDirty}
        className="mt-4 rounded-md bg-black px-4 py-2.5 text-sm text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSaving ? 'Saving...' : 'Save best sellers'}
      </button>
    </AdminCollapsibleSection>
  )
}
