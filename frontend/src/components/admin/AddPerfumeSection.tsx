import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import Button from '../common/ui/Button'
import Input from '../common/ui/Input'
import Select from '../common/ui/Select'
import Textarea from '../common/ui/Textarea'
import { useCreateProductMutation } from '../../hooks/useCreateProductMutation'
import {
  adminCreatePerfumeSchema,
  type AdminCreatePerfumePayload,
} from '../../schema/adminCreatePerfume.schema'
import type { Category } from '../../types/product'
import { useI18n } from '../../i18n'

type AddPerfumeSectionProps = {
  categories: Category[]
  isLoadingCategories: boolean
}

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
    formState: { errors, isSubmitting },
  } = useForm<AdminCreatePerfumePayload>({
    resolver: zodResolver(adminCreatePerfumeSchema),
    defaultValues: {
      name: '',
      gender: 'unisex',
      categoryId: 0,
      description: '',
      price30Ml: 6,
      price55Ml: 8,
      price100Ml: 15,
    },
  })

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
        price30Ml: values.price30Ml,
        price55Ml: values.price55Ml,
        price100Ml: values.price100Ml,
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
      className="space-y-4 rounded-xl border border-black/10 bg-white/90 p-4 sm:p-5 lg:p-6"
    >
      <h2 className="text-base font-semibold sm:text-lg">{t('admin.addPerfume')}</h2>
      <div className="space-y-2">
        <label htmlFor="perfume-name" className="block text-sm font-medium">
          {t('common.name')}
        </label>
        <Input
          id="perfume-name"
          type="text"
          {...register('name')}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="perfume-category" className="block text-sm font-medium">
          {t('common.category')}
        </label>
        <Select
          id="perfume-category"
          {...register('categoryId', { valueAsNumber: true })}
          disabled={isLoadingCategories}
        >
          <option value={0}>{t('admin.selectCategory')}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        {errors.categoryId && <p className="text-sm text-red-600">{errors.categoryId.message}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="perfume-gender" className="block text-sm font-medium">
          {t('common.gender')}
        </label>
        <Select
          id="perfume-gender"
          {...register('gender')}
        >
          <option value="unisex">{t('common.unisex')}</option>
          <option value="male">{t('common.male')}</option>
          <option value="female">{t('common.female')}</option>
        </Select>
        {errors.gender && <p className="text-sm text-red-600">{errors.gender.message}</p>}
      </div>
      <div className="space-y-2">
        <p className="block text-sm font-medium">{t('admin.sizePrices')}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label htmlFor="perfume-price-30ml" className="block text-xs text-black/65">
              30ml
            </label>
            <Input
              id="perfume-price-30ml"
              type="number"
              min="0.01"
              step="0.01"
              {...register('price30Ml', { valueAsNumber: true })}
            />
            {errors.price30Ml && <p className="text-xs text-red-600">{errors.price30Ml.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label htmlFor="perfume-price-55ml" className="block text-xs text-black/65">
              55ml
            </label>
            <Input
              id="perfume-price-55ml"
              type="number"
              min="0.01"
              step="0.01"
              {...register('price55Ml', { valueAsNumber: true })}
            />
            {errors.price55Ml && <p className="text-xs text-red-600">{errors.price55Ml.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label htmlFor="perfume-price-100ml" className="block text-xs text-black/65">
              100ml
            </label>
            <Input
              id="perfume-price-100ml"
              type="number"
              min="0.01"
              step="0.01"
              {...register('price100Ml', { valueAsNumber: true })}
            />
            {errors.price100Ml && <p className="text-xs text-red-600">{errors.price100Ml.message}</p>}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="perfume-description" className="block text-sm font-medium">
          {t('common.description')}
        </label>
        <Textarea
          id="perfume-description"
          {...register('description')}
          className="min-h-28"
        />
        {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="perfume-image" className="block text-sm font-medium">
          {t('common.image')}
        </label>
        <Input
          id="perfume-image"
          type="file"
          accept="image/*"
          {...register('image')}
        />
        {errors.image && <p className="text-sm text-red-600">{errors.image.message}</p>}
      </div>
      {errors.root && <p className="text-sm text-red-600">{errors.root.message}</p>}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? t('admin.creating') : t('admin.createPerfume')}
      </Button>
    </form>
  )
}
