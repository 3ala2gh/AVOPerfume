import { Minus, Plus, Trash2 } from 'lucide-react'

type QuantityStepperProps = {
  quantity: number
  itemName: string
  onDecrease: () => void
  onIncrease: () => void
}

export default function QuantityStepper({
  quantity,
  itemName,
  onDecrease,
  onIncrease,
}: QuantityStepperProps) {
  return (
    <div
      className="inline-flex h-9 items-center overflow-hidden rounded-full border border-ink/15 bg-white transition-colors focus-within:border-champagne"
      aria-label={`Quantity for ${itemName}`}
    >
      <button
        type="button"
        onClick={onDecrease}
        className="flex h-full w-9 items-center justify-center text-ink/60 transition-colors hover:bg-ink hover:text-white focus:outline-none"
        aria-label={quantity === 1 ? `Remove ${itemName}` : `Decrease ${itemName} quantity`}
      >
        {quantity === 1 ? <Trash2 className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
      </button>
      <span
        className="min-w-8 select-none border-x border-ink/10 px-2 text-center text-sm font-light tabular-nums"
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        className="flex h-full w-9 items-center justify-center text-ink/60 transition-colors hover:bg-ink hover:text-white focus:outline-none"
        aria-label={`Increase ${itemName} quantity`}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
