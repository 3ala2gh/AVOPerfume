import { useMemo, useState, type FormEvent } from 'react'
import type { Product } from '../../types/product'
import Input from '../common/ui/Input'

type Props = { products: Product[]; isLoading: boolean; isSaving: boolean; onSave: (percentage: number, all: boolean, ids: number[]) => Promise<void> }

export default function DiscountManagementSection({ products, isLoading, isSaving, onSave }: Props) {
  const [discount, setDiscount] = useState('')
  const [applyToAll, setApplyToAll] = useState(true)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [search, setSearch] = useState('')
  const visible = useMemo(() => products.filter((product) => product.name.toLowerCase().includes(search.trim().toLowerCase())), [products, search])

  async function submit(event: FormEvent) {
    event.preventDefault()
    const percentage = Number(discount)
    if (percentage < 0 || percentage > 100 || (!applyToAll && !selectedIds.length)) return
    await onSave(percentage, applyToAll, selectedIds)
  }

  return <section className="rounded-md border border-black/10 p-4 sm:p-6">
    <h2 className="mb-1 text-xl tracking-wide">Discounts</h2>
    <p className="mb-4 text-sm text-black/60">Set 0% to remove a discount.</p>
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm"><span className="mb-1 block">Discount percentage</span><Input type="number" min="0" max="100" step="0.01" required value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="25" /></label>
      <div className="flex gap-5 text-sm">
        <label className="flex items-center gap-2"><input type="radio" checked={applyToAll} onChange={() => setApplyToAll(true)} /> All perfumes</label>
        <label className="flex items-center gap-2"><input type="radio" checked={!applyToAll} onChange={() => setApplyToAll(false)} /> Selected perfumes</label>
      </div>
      {!applyToAll && <div className="space-y-2">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search perfumes..." />
        <div className="max-h-52 overflow-y-auto rounded border border-black/10 p-2">
          {isLoading ? <p className="p-2 text-sm text-black/60">Loading...</p> : visible.map((product) => <label key={product.id} className="flex items-center gap-2 rounded p-2 text-sm hover:bg-black/5">
            <input type="checkbox" checked={selectedIds.includes(product.id)} onChange={() => setSelectedIds((ids) => ids.includes(product.id) ? ids.filter((id) => id !== product.id) : [...ids, product.id])} />
            {product.name}{product.discountPercent ? <span className="ml-auto text-black/50">{product.discountPercent}% off</span> : null}
          </label>)}
        </div>
      </div>}
      <button disabled={isSaving || (!applyToAll && !selectedIds.length)} className="rounded-md bg-black px-4 py-2.5 text-sm text-white disabled:opacity-50">{isSaving ? 'Saving...' : 'Save discount'}</button>
    </form>
  </section>
}
