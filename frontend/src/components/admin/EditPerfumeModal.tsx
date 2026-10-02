import { type FormEvent, useState } from 'react'
import Modal from '../common/Modal'
import { CircleAlert, Trash2 } from 'lucide-react'
import Input from '../common/ui/Input'
import Select from '../common/ui/Select'
import Textarea from '../common/ui/Textarea'
import type { Category, Product } from '../../types/product'
import { useI18n } from '../../hooks/useI18n'
import { getOptimizedCloudinaryUrl } from '../../utils/cloudinary'
import AdminButton from './AdminButton'
import AdminField from './AdminField'
import ImagePicker from './ImagePicker'
import SizePriceCard from './SizePriceCard'

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
  is10MlEnabled: boolean
  is30MlEnabled: boolean
  is55MlEnabled: boolean
  is100MlEnabled: boolean
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
  const [is10MlEnabled, setIs10MlEnabled] = useState(
    perfume?.sizes.find((size) => size.size === '10ml')?.enabled ?? true,
  )
  const [is30MlEnabled, setIs30MlEnabled] = useState(
    perfume?.sizes.find((size) => size.size === '30ml')?.enabled ?? true,
  )
  const [is55MlEnabled, setIs55MlEnabled] = useState(
    perfume?.sizes.find((size) => size.size === '55ml')?.enabled ?? true,
  )
  const [is100MlEnabled, setIs100MlEnabled] = useState(
    perfume?.sizes.find((size) => size.size === '100ml')?.enabled ?? true,
  )
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
      is10MlEnabled,
      is30MlEnabled,
      is55MlEnabled,
      is100MlEnabled,
      image: image ?? undefined,
    })
  }

  const sizeFields = [
    { size: '10ml', price: price10Ml, setPrice: setPrice10Ml, enabled: is10MlEnabled, setEnabled: setIs10MlEnabled },
    { size: '30ml', price: price30Ml, setPrice: setPrice30Ml, enabled: is30MlEnabled, setEnabled: setIs30MlEnabled },
    { size: '55ml', price: price55Ml, setPrice: setPrice55Ml, enabled: is55MlEnabled, setEnabled: setIs55MlEnabled },
    { size: '100ml', price: price100Ml, setPrice: setPrice100Ml, enabled: is100MlEnabled, setEnabled: setIs100MlEnabled },
  ]
  const isBusy = isUpdatingPerfume || isDeletingPerfume

  return (
    <Modal
      isOpen={perfume !== null}
      onClose={onClose}
      title={perfume ? t('admin.editNamedPerfume', { name: perfume.name }) : t('admin.editPerfume')}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        <header className="border-b border-ink/[0.08] px-5 py-4 pe-14 sm:px-6">
          <h2 className="truncate text-lg font-semibold text-ink">
            {perfume ? t('admin.editNamedPerfume', { name: perfume.name }) : t('admin.editPerfume')}
          </h2>
          {perfume ? (
            <p className="mt-0.5 text-sm text-ink-muted">{perfume.category}</p>
          ) : null}
        </header>

        <div className="space-y-6 px-5 py-5 sm:px-6">
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AdminField label={t('common.name')} htmlFor="edit-perfume-name" className="sm:col-span-2">
              <Input
                id="edit-perfume-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </AdminField>
            <AdminField label={t('common.category')} htmlFor="edit-perfume-category">
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
            </AdminField>
            <AdminField label={t('common.gender')} htmlFor="edit-perfume-gender">
              <Select
                id="edit-perfume-gender"
                value={gender}
                onChange={(event) => setGender(event.target.value as 'male' | 'female' | 'unisex')}
              >
                <option value="unisex">{t('common.unisex')}</option>
                <option value="male">{t('common.male')}</option>
                <option value="female">{t('common.female')}</option>
              </Select>
            </AdminField>
          </section>

          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-ink">{t('admin.stepPrices')}</h3>
              <p className="text-xs text-ink-muted">{t('admin.stepPricesHint')}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
              {sizeFields.map((field) => (
                <SizePriceCard
                  key={field.size}
                  id={`edit-perfume-price-${field.size}`}
                  size={field.size}
                  enabled={field.enabled}
                  onEnabledChange={field.setEnabled}
                  inputProps={{
                    value: field.price,
                    onChange: (event) => field.setPrice(event.target.value),
                  }}
                />
              ))}
            </div>
          </section>

          <AdminField label={t('common.description')} htmlFor="edit-perfume-description">
            <Textarea
              id="edit-perfume-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={t('admin.descriptionPlaceholder')}
              className="min-h-28"
            />
          </AdminField>

          <AdminField label={t('admin.replaceImage')} htmlFor="edit-perfume-image">
            <ImagePicker
              id="edit-perfume-image"
              file={image}
              existingUrl={perfume?.imageUrl ? getOptimizedCloudinaryUrl(perfume.imageUrl, { width: 200 }) : null}
              inputProps={{ onChange: (event) => setImage(event.target.files?.item(0) ?? null) }}
            />
          </AdminField>

          {localError ? (
            <p role="alert" className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              <CircleAlert className="h-4 w-4 shrink-0" />
              {localError}
            </p>
          ) : null}
        </div>

        <footer className="sticky bottom-0 flex items-center gap-2 border-t border-ink/[0.08] bg-white/95 px-4 py-3 backdrop-blur sm:px-6 sm:py-4">
          <AdminButton
            variant="danger-outline"
            icon={Trash2}
            onClick={() => void onDelete()}
            disabled={isBusy}
            isLoading={isDeletingPerfume}
            aria-label={t('admin.deletePerfume')}
            className="px-3 sm:px-4"
          >
            <span className="hidden sm:inline">
              {isDeletingPerfume ? t('admin.deleting') : t('admin.deletePerfume')}
            </span>
          </AdminButton>
          <AdminButton variant="outline" onClick={onClose} disabled={isDeletingPerfume} className="flex-1 sm:ms-auto sm:flex-none">
            {t('common.cancel')}
          </AdminButton>
          <AdminButton type="submit" disabled={isBusy} isLoading={isUpdatingPerfume} className="flex-1 sm:flex-none">
            {isUpdatingPerfume ? t('admin.saving') : t('admin.saveChanges')}
          </AdminButton>
        </footer>
      </form>
    </Modal>
  )
}

export type { EditPerfumePayload }
