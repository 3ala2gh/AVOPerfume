import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { CirclePlus } from 'lucide-react'
import Input from '../common/ui/Input'
import Select from '../common/ui/Select'
import Textarea from '../common/ui/Textarea'
import { useCreateProductMutation } from '../../hooks/useCreateProductMutation'
import {
  adminCreatePerfumeSchema,
  type AdminCreatePerfumePayload,
} from '../../schema/adminCreatePerfume.schema'
import type { Category } from '../../types/product'
import { useI18n } from '../../hooks/useI18n'
import AdminButton from './AdminButton'
import AdminField from './AdminField'
import AdminPanel from './AdminPanel'
import ImagePicker from './ImagePicker'
import SizePriceCard from './SizePriceCard'

type AddPerfumeSectionProps = {
  categories: Category[]
  isLoadingCategories: boolean
}

const SIZE_FIELDS = [
  { size: '10ml', price: 'price10Ml', enabled: 'is10MlEnabled' },
  { size: '30ml', price: 'price30Ml', enabled: 'is30MlEnabled' },
  { size: '55ml', price: 'price55Ml', enabled: 'is55MlEnabled' },
  { size: '100ml', price: 'price100Ml', enabled: 'is100MlEnabled' },
] as const

export default function AddPerfumeSection({
  categories,
  isLoadingCategories,
}: AddPerfumeSectionProps) {
  const queryClient = useQueryClient()
  const { t } = useI18n()
  const { mutateAsync: createProductMutation } = useCreateProductMutation()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AdminCreatePerfumePayload>({
    resolver: zodResolver(adminCreatePerfumeSchema),
    defaultValues: {
      name: '',
      gender: 'unisex',
      categoryId: 0,
      description: '',
      price10Ml: 2,
      price30Ml: 6,
      price55Ml: 8,
      price100Ml: 15,
      is10MlEnabled: true,
      is30MlEnabled: true,
      is55MlEnabled: true,
      is100MlEnabled: true,
    },
  })
  const [is10MlEnabled, is30MlEnabled, is55MlEnabled, is100MlEnabled, imageFiles] = useWatch({
    control,
    name: ['is10MlEnabled', 'is30MlEnabled', 'is55MlEnabled', 'is100MlEnabled', 'image'],
  })
  const enabledBySize = { is10MlEnabled, is30MlEnabled, is55MlEnabled, is100MlEnabled }
  const selectedImage = imageFiles?.item(0)

  async function onSubmit(values: AdminCreatePerfumePayload) {
    const image = values.image.item(0)
    if (!image) {
      setError('image', { message: t('admin.imageRequired') })
      return
    }

    try {
      await createProductMutation({
        name: values.name.trim(),
        description: values.description.trim(),
        gender: values.gender,
        categoryId: values.categoryId,
        price: values.price55Ml,
        price10Ml: values.price10Ml,
        price30Ml: values.price30Ml,
        price55Ml: values.price55Ml,
        price100Ml: values.price100Ml,
        is10MlEnabled: values.is10MlEnabled,
        is30MlEnabled: values.is30MlEnabled,
        is55MlEnabled: values.is55MlEnabled,
        is100MlEnabled: values.is100MlEnabled,
        image,
      })
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success(t('admin.perfumeCreated'))
      reset()
    } catch {
      toast.error(t('admin.createError'))
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6"
      noValidate
    >
      <div className="space-y-5 lg:col-span-2 lg:space-y-6">
        <AdminPanel step={1} title={t('admin.stepBasics')} description={t('admin.stepBasicsHint')}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AdminField
              label={t('common.name')}
              htmlFor="perfume-name"
              error={errors.name?.message}
              className="sm:col-span-2"
            >
              <Input
                id="perfume-name"
                type="text"
                placeholder={t('admin.namePlaceholder')}
                aria-invalid={Boolean(errors.name)}
                {...register('name')}
              />
            </AdminField>
            <AdminField
              label={t('common.category')}
              htmlFor="perfume-category"
              error={errors.categoryId?.message}
            >
              <Select
                id="perfume-category"
                disabled={isLoadingCategories}
                aria-invalid={Boolean(errors.categoryId)}
                {...register('categoryId', { valueAsNumber: true })}
              >
                <option value={0}>{t('admin.selectCategory')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </AdminField>
            <AdminField label={t('common.gender')} htmlFor="perfume-gender" error={errors.gender?.message}>
              <Select id="perfume-gender" {...register('gender')}>
                <option value="unisex">{t('common.unisex')}</option>
                <option value="male">{t('common.male')}</option>
                <option value="female">{t('common.female')}</option>
              </Select>
            </AdminField>
            <AdminField
              label={t('common.description')}
              htmlFor="perfume-description"
              error={errors.description?.message}
              className="sm:col-span-2"
            >
              <Textarea
                id="perfume-description"
                placeholder={t('admin.descriptionPlaceholder')}
                className="min-h-28"
                {...register('description')}
              />
            </AdminField>
          </div>
        </AdminPanel>

        <AdminPanel step={2} title={t('admin.stepPrices')} description={t('admin.stepPricesHint')}>
          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
            {SIZE_FIELDS.map(({ size, price, enabled }) => (
              <SizePriceCard
                key={size}
                id={`perfume-price-${size}`}
                size={size}
                enabled={enabledBySize[enabled]}
                onEnabledChange={(value) => setValue(enabled, value, { shouldDirty: true })}
                error={errors[price]?.message}
                inputProps={register(price, { valueAsNumber: true })}
              />
            ))}
          </div>
        </AdminPanel>
      </div>

      <div className="space-y-5 lg:sticky lg:top-28 lg:h-fit lg:space-y-6">
        <AdminPanel step={3} title={t('admin.stepImage')} description={t('admin.stepImageHint')}>
          <ImagePicker
            id="perfume-image"
            file={selectedImage}
            invalid={Boolean(errors.image)}
            inputProps={register('image')}
          />
          {errors.image?.message ? (
            <p className="mt-2 text-xs font-medium text-red-600">{errors.image.message}</p>
          ) : null}
        </AdminPanel>

        {errors.root ? <p className="text-sm text-red-600">{errors.root.message}</p> : null}

        <AdminButton type="submit" icon={CirclePlus} isLoading={isSubmitting} className="w-full">
          {isSubmitting ? t('admin.creating') : t('admin.createPerfume')}
        </AdminButton>
      </div>
    </form>
  )
}
