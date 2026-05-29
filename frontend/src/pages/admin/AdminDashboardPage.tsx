import { zodResolver } from '@hookform/resolvers/zod'
import { type FormEvent, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useAdminCreatePerfumeSubmit } from '../../hooks/useAdminCreatePerfumeSubmit'
import { createCategory } from '../../api/products.api'
import { useCategoriesQuery } from '../../hooks/useCategoriesQuery'
import {
  adminCreatePerfumeSchema,
  type AdminCreatePerfumePayload,
} from '../../schema/adminCreatePerfume.schema'

type AdminDashboardPageProps = {
  onLogout: () => void
}

function AdminDashboardPage({ onLogout }: AdminDashboardPageProps) {
  const queryClient = useQueryClient()
  const { data: categories = [], isLoading: isLoadingCategories } = useCategoriesQuery()
  const [newCategoryName, setNewCategoryName] = useState('')
  const [categorySuccess, setCategorySuccess] = useState('')
  const [categoryError, setCategoryError] = useState('')
  const [success, setSuccess] = useState('')
  const {
    mutateAsync: createCategoryMutation,
    isPending: isAddingCategory,
  } = useMutation({
    mutationFn: (name: string) => createCategory(name),
  })

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
      categoryId: 0,
      description: '',
      price: 0,
    },
  })
  const onSubmit = useAdminCreatePerfumeSubmit({ reset, setError, setSuccess })

  async function handleCreateCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCategoryError('')
    setCategorySuccess('')

    const normalizedName = newCategoryName.trim()
    if (!normalizedName) {
      setCategoryError('Category name is required.')
      return
    }

    try {
      await createCategoryMutation(normalizedName)
      await queryClient.invalidateQueries({ queryKey: ['categories'] })
      setCategorySuccess('Category added successfully.')
      setNewCategoryName('')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setCategoryError('Unable to add category right now.')
    }
  }

  return (
    <main className="container">
      <h1>Admin Dashboard</h1>
      <p className="lead">This area is restricted to logged in admins only.</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 max-w-xl space-y-4 rounded-xl border border-black/10 bg-white/90 p-5"
      >
        <h2 className="text-lg font-semibold">Add Perfume</h2>
        <div className="space-y-2">
          <label htmlFor="perfume-name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="perfume-name"
            type="text"
            {...register('name')}
            className="w-full rounded-md border border-black/20 px-3 py-2 outline-none focus:border-black"
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="perfume-category" className="block text-sm font-medium">
            Category
          </label>
          <select
            id="perfume-category"
            {...register('categoryId', { valueAsNumber: true })}
            className="w-full rounded-md border border-black/20 px-3 py-2 outline-none focus:border-black"
            disabled={isLoadingCategories}
          >
            <option value={0}>Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-sm text-red-600">{errors.categoryId.message}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="perfume-price" className="block text-sm font-medium">
            Price
          </label>
          <input
            id="perfume-price"
            type="number"
            min="0.01"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            className="w-full rounded-md border border-black/20 px-3 py-2 outline-none focus:border-black"
          />
          {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="perfume-description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="perfume-description"
            {...register('description')}
            className="min-h-28 w-full rounded-md border border-black/20 px-3 py-2 outline-none focus:border-black"
          />
          {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="perfume-image" className="block text-sm font-medium">
            Image
          </label>
          <input
            id="perfume-image"
            type="file"
            accept="image/*"
            {...register('image')}
            className="w-full rounded-md border border-black/20 px-3 py-2 outline-none focus:border-black"
          />
          {errors.image && <p className="text-sm text-red-600">{errors.image.message}</p>}
        </div>
        {errors.root && <p className="text-sm text-red-600">{errors.root.message}</p>}
        {success && <p className="text-sm text-green-700">{success}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-black px-4 py-2 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Creating...' : 'Create Perfume'}
        </button>
      </form>
      <form
        onSubmit={handleCreateCategory}
        className="mt-4 max-w-xl space-y-3 rounded-xl border border-black/10 bg-white/90 p-5"
      >
        <h2 className="text-lg font-semibold">Add Category</h2>
        <div className="space-y-2">
          <label htmlFor="category-name" className="block text-sm font-medium">
            Category Name
          </label>
          <input
            id="category-name"
            type="text"
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
            className="w-full rounded-md border border-black/20 px-3 py-2 outline-none focus:border-black"
          />
        </div>
        {categoryError && <p className="text-sm text-red-600">{categoryError}</p>}
        {categorySuccess && <p className="text-sm text-green-700">{categorySuccess}</p>}
        <button
          type="submit"
          disabled={isAddingCategory}
          className="rounded-md bg-black px-4 py-2 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isAddingCategory ? 'Adding...' : 'Add Category'}
        </button>
      </form>
      <button
        type="button"
        onClick={onLogout}
        className="mt-4 rounded-md bg-black px-4 py-2 text-white transition-opacity hover:opacity-90"
      >
        Logout
      </button>
    </main>
  )
}

export default AdminDashboardPage
