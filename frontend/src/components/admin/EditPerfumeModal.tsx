import { type FormEvent, useState } from 'react'
import Modal from '../common/Modal'
import Button from '../common/ui/Button'
import Input from '../common/ui/Input'
import Select from '../common/ui/Select'
import Textarea from '../common/ui/Textarea'
import type { Category, Product } from '../../types/product'

type EditPerfumePayload = {
  name: string
  description: string
  gender: 'male' | 'female' | 'unisex'
  categoryId: number
  price: number
  image?: File
}

type EditPerfumeModalProps = {
  categories: Category[]
  isLoadingCategories: boolean
  isUpdatingPerfume: boolean
  isDeletingPerfume: boolean
  perfume: Product | null
  onClose: () => void
  onSubmit: (payload: EditPerfumePayload) => Promise<void>
  onDelete: () => Promise<void>
}

export default function EditPerfumeModal({
  categories,
  isLoadingCategories,
  isUpdatingPerfume,
  isDeletingPerfume,
  perfume,
  onClose,
  onSubmit,
  onDelete,
}: EditPerfumeModalProps) {
  const [name, setName] = useState(perfume?.name ?? '')
  const [description, setDescription] = useState(perfume?.description ?? '')
  const [gender, setGender] = useState<'male' | 'female' | 'unisex'>(
    perfume?.gender ?? 'unisex',
  )
  const [categoryId, setCategoryId] = useState(perfume?.categoryId ?? 0)
  const [price, setPrice] = useState(perfume ? String(perfume.price) : '')
  const [image, setImage] = useState<File | null>(null)
  const [localError, setLocalError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLocalError('')

    const normalizedName = name.trim()
    const normalizedDescription = description.trim()
    const normalizedPrice = Number(price)

    if (!normalizedName) {
      setLocalError('Name is required.')
      return
    }

    if (!categoryId || categoryId <= 0) {
      setLocalError('Category is required.')
      return
    }

    if (!Number.isFinite(normalizedPrice) || normalizedPrice <= 0) {
      setLocalError('Price must be greater than 0.')
      return
    }

    await onSubmit({
      name: normalizedName,
      description: normalizedDescription,
      gender,
      categoryId,
      price: normalizedPrice,
      image: image ?? undefined,
    })
  }

  return (
    <Modal
      isOpen={perfume !== null}
      onClose={onClose}
      title={perfume ? `Edit ${perfume.name}` : 'Edit Perfume'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-6">
        <h2 className="text-base font-semibold sm:text-lg">
          {perfume ? `Edit ${perfume.name}` : 'Edit Perfume'}
        </h2>
        <div className="space-y-2">
          <label htmlFor="edit-perfume-name" className="block text-sm font-medium">
            Name
          </label>
          <Input
            id="edit-perfume-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="edit-perfume-gender" className="block text-sm font-medium">
            Gender
          </label>
          <Select
            id="edit-perfume-gender"
            value={gender}
            onChange={(event) => setGender(event.target.value as 'male' | 'female' | 'unisex')}
          >
            <option value="unisex">Unisex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Select>
        </div>
        <div className="space-y-2">
          <label htmlFor="edit-perfume-category" className="block text-sm font-medium">
            Category
          </label>
          <Select
            id="edit-perfume-category"
            value={categoryId}
            onChange={(event) => setCategoryId(Number(event.target.value))}
            disabled={isLoadingCategories}
          >
            <option value={0}>Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <label htmlFor="edit-perfume-price" className="block text-sm font-medium">
            Price
          </label>
          <Input
            id="edit-perfume-price"
            type="number"
            min="0.01"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="edit-perfume-description" className="block text-sm font-medium">
            Description
          </label>
          <Textarea
            id="edit-perfume-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-28"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="edit-perfume-image" className="block text-sm font-medium">
            Replace Image (optional)
          </label>
          <Input
            id="edit-perfume-image"
            type="file"
            accept="image/*"
            onChange={(event) => setImage(event.target.files?.item(0) ?? null)}
          />
        </div>
        {localError && <p className="text-sm text-red-600">{localError}</p>}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="submit"
            disabled={isUpdatingPerfume || isDeletingPerfume}
            className="w-full sm:w-auto"
          >
            {isUpdatingPerfume ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            onClick={() => void onDelete()}
            disabled={isUpdatingPerfume || isDeletingPerfume}
            variant="danger"
            className="w-full sm:w-auto"
          >
            {isDeletingPerfume ? 'Deleting...' : 'Delete Perfume'}
          </Button>
          <Button
            type="button"
            onClick={onClose}
            disabled={isDeletingPerfume}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export type { EditPerfumePayload }
