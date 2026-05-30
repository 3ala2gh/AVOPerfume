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

type AddPerfumeSectionProps = {
  categories: Category[]
  isLoadingCategories: boolean
}

export default function AddPerfumeSection({
  categories,
  isLoadingCategories,
}: AddPerfumeSectionProps) {
  const queryClient = useQueryClient()
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
      price: 0,
    },
  })

  async function onSubmit(values: AdminCreatePerfumePayload) {
    const image = values.image.item(0)
    if (!image) {
      setError('image', { message: 'Image is required' })
      return
    }

    try {
      await createProductMutation({
        name: values.name.trim(),
        description: values.description.trim(),
        gender: values.gender,
        categoryId: values.categoryId,
        price: values.price,
        image,
      })
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Perfume created successfully.')
      reset()
    } catch {
      toast.error('Unable to create perfume right now.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border border-black/10 bg-white/90 p-4 sm:p-5 lg:p-6"
    >
      <h2 className="text-base font-semibold sm:text-lg">Add Perfume</h2>
      <div className="space-y-2">
        <label htmlFor="perfume-name" className="block text-sm font-medium">
          Name
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
          Category
        </label>
        <Select
          id="perfume-category"
          {...register('categoryId', { valueAsNumber: true })}
          disabled={isLoadingCategories}
        >
          <option value={0}>Select category</option>
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
          Gender
        </label>
        <Select
          id="perfume-gender"
          {...register('gender')}
        >
          <option value="unisex">Unisex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </Select>
        {errors.gender && <p className="text-sm text-red-600">{errors.gender.message}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="perfume-price" className="block text-sm font-medium">
          Price
        </label>
        <Input
          id="perfume-price"
          type="number"
          min="0.01"
          step="0.01"
          {...register('price', { valueAsNumber: true })}
        />
        {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="perfume-description" className="block text-sm font-medium">
          Description
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
          Image
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
        {isSubmitting ? 'Creating...' : 'Create Perfume'}
      </Button>
    </form>
  )
}
