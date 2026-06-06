import { type FormEvent, useState } from 'react'
import Modal from '../common/Modal'
import Button from '../common/ui/Button'
import Input from '../common/ui/Input'
import Select from '../common/ui/Select'
import Textarea from '../common/ui/Textarea'
import type { Category, Product } from '../../types/product'
import { useI18n } from '../../hooks/useI18n'

type EditPerfumePayload = {
  name: string
  description: string
  gender: 'male' | 'female' | 'unisex'
  categoryId: number
  price: number
  price10Ml: number
  price30Ml: number
  price55Ml: number
  price100Ml: number
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
  const { t } = useI18n()
  const [name, setName] = useState(perfume?.name ?? '')
  const [description, setDescription] = useState(perfume?.description ?? '')
  const [gender, setGender] = useState<'male' | 'female' | 'unisex'>(
    perfume?.gender ?? 'unisex',
  )
  const [categoryId, setCategoryId] = useState(perfume?.categoryId ?? 0)
  const [price10Ml, setPrice10Ml] = useState(perfume ? String(perfume.price10Ml) : '2')
  const [price30Ml, setPrice30Ml] = useState(perfume ? String(perfume.price30Ml) : '6')
  const [price55Ml, setPrice55Ml] = useState(perfume ? String(perfume.price55Ml) : '8')
  const [price100Ml, setPrice100Ml] = useState(perfume ? String(perfume.price100Ml) : '15')
  const [image, setImage] = useState<File | null>(null)
  const [localError, setLocalError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLocalError('')

    const normalizedName = name.trim()
    const normalizedDescription = description.trim()
    const normalizedPrice10Ml = Number(price10Ml)
    const normalizedPrice30Ml = Number(price30Ml)
    const normalizedPrice55Ml = Number(price55Ml)
    const normalizedPrice100Ml = Number(price100Ml)

    if (!normalizedName) {
      setLocalError(t('admin.nameRequired'))
      return
    }

    if (!categoryId || categoryId <= 0) {
      setLocalError(t('admin.categoryRequired'))
      return
    }

    if (
      !Number.isFinite(normalizedPrice10Ml) ||
      !Number.isFinite(normalizedPrice30Ml) ||
      !Number.isFinite(normalizedPrice55Ml) ||
      !Number.isFinite(normalizedPrice100Ml) ||
      normalizedPrice10Ml <= 0 ||
      normalizedPrice30Ml <= 0 ||
      normalizedPrice55Ml <= 0 ||
      normalizedPrice100Ml <= 0
    ) {
      setLocalError(t('admin.priceRequired'))
      return
    }

    await onSubmit({
      name: normalizedName,
      description: normalizedDescription,
      gender,
      categoryId,
      price: normalizedPrice55Ml,
      price10Ml: normalizedPrice10Ml,
      price30Ml: normalizedPrice30Ml,
      price55Ml: normalizedPrice55Ml,
      price100Ml: normalizedPrice100Ml,
      image: image ?? undefined,
    })
  }

  return (
    <Modal
      isOpen={perfume !== null}
      onClose={onClose}
      title={perfume ? t('admin.editNamedPerfume', { name: perfume.name }) : t('admin.editPerfume')}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-6">
        <h2 className="text-base font-semibold sm:text-lg">
          {perfume ? t('admin.editNamedPerfume', { name: perfume.name }) : t('admin.editPerfume')}
        </h2>
        <div className="space-y-2">
          <label htmlFor="edit-perfume-name" className="block text-sm font-medium">
            {t('common.name')}
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
            {t('common.gender')}
          </label>
          <Select
            id="edit-perfume-gender"
            value={gender}
            onChange={(event) => setGender(event.target.value as 'male' | 'female' | 'unisex')}
          >
            <option value="unisex">{t('common.unisex')}</option>
            <option value="male">{t('common.male')}</option>
            <option value="female">{t('common.female')}</option>
          </Select>
        </div>
        <div className="space-y-2">
          <label htmlFor="edit-perfume-category" className="block text-sm font-medium">
            {t('common.category')}
          </label>
          <Select
            id="edit-perfume-category"
            value={categoryId}
            onChange={(event) => setCategoryId(Number(event.target.value))}
            disabled={isLoadingCategories}
          >
            <option value={0}>{t('admin.selectCategory')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <p className="block text-sm font-medium">{t('admin.sizePrices')}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="edit-perfume-price-10ml" className="block text-xs text-black/65">
                10ml
              </label>
              <Input
                id="edit-perfume-price-10ml"
                type="number"
                min="0.01"
                step="0.01"
                value={price10Ml}
                onChange={(event) => setPrice10Ml(event.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="edit-perfume-price-30ml" className="block text-xs text-black/65">
                30ml
              </label>
              <Input
                id="edit-perfume-price-30ml"
                type="number"
                min="0.01"
                step="0.01"
                value={price30Ml}
                onChange={(event) => setPrice30Ml(event.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="edit-perfume-price-55ml" className="block text-xs text-black/65">
                55ml
              </label>
              <Input
                id="edit-perfume-price-55ml"
                type="number"
                min="0.01"
                step="0.01"
                value={price55Ml}
                onChange={(event) => setPrice55Ml(event.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="edit-perfume-price-100ml" className="block text-xs text-black/65">
                100ml
              </label>
              <Input
                id="edit-perfume-price-100ml"
                type="number"
                min="0.01"
                step="0.01"
                value={price100Ml}
                onChange={(event) => setPrice100Ml(event.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="edit-perfume-description" className="block text-sm font-medium">
            {t('common.description')}
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
            {t('admin.replaceImage')}
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
            {isUpdatingPerfume ? t('admin.saving') : t('admin.saveChanges')}
          </Button>
          <Button
            type="button"
            onClick={() => void onDelete()}
            disabled={isUpdatingPerfume || isDeletingPerfume}
            variant="danger"
            className="w-full sm:w-auto"
          >
            {isDeletingPerfume ? t('admin.deleting') : t('admin.deletePerfume')}
          </Button>
          <Button
            type="button"
            onClick={onClose}
            disabled={isDeletingPerfume}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {t('common.cancel')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export type { EditPerfumePayload }
