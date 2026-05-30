import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import AddCategorySection from '../../components/admin/AddCategorySection'
import AddPerfumeSection from '../../components/admin/AddPerfumeSection'
import EditPerfumeModal, {
  type EditPerfumePayload,
} from '../../components/admin/EditPerfumeModal'
import PerfumeSearchSection from '../../components/admin/PerfumeSearchSection'
import { useCategoriesQuery } from '../../hooks/useCategoriesQuery'
import { useCreateCategoryMutation } from '../../hooks/useCreateCategoryMutation'
import { useDeleteProductMutation } from '../../hooks/useDeleteProductMutation'
import { useProductsQuery } from '../../hooks/useProductsQuery'
import { useUpdateProductMutation } from '../../hooks/useUpdateProductMutation'
import type { Product } from '../../types/product'

type AdminDashboardPageProps = {
  onLogout: () => void
}

function AdminDashboardPage({ onLogout }: AdminDashboardPageProps) {
  const queryClient = useQueryClient()
  const { data: categories = [], isLoading: isLoadingCategories } = useCategoriesQuery()
  const { data: products = [], isLoading: isLoadingProducts } = useProductsQuery()
  const [editingPerfume, setEditingPerfume] = useState<Product | null>(null)

  const { mutateAsync: createCategoryMutation, isPending: isAddingCategory } =
    useCreateCategoryMutation()
  const { mutateAsync: updatePerfumeMutation, isPending: isUpdatingPerfume } =
    useUpdateProductMutation()
  const { mutateAsync: deletePerfumeMutation, isPending: isDeletingPerfume } =
    useDeleteProductMutation()

  async function handleCreateCategory(name: string) {
    await createCategoryMutation(name)
    await queryClient.invalidateQueries({ queryKey: ['categories'] })
  }

  function openEditModal(product: Product) {
    setEditingPerfume(product)
  }

  function closeEditModal() {
    setEditingPerfume(null)
  }

  async function handleUpdatePerfume(values: EditPerfumePayload) {
    if (!editingPerfume) {
      return
    }

    try {
      await updatePerfumeMutation({
        id: editingPerfume.id,
        name: values.name,
        description: values.description,
        gender: values.gender,
        categoryId: values.categoryId,
        price: values.price,
        image: values.image,
      })
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Perfume updated successfully.')
    } catch {
      toast.error('Unable to update perfume right now.')
    }
  }

  async function handleDeletePerfume() {
    if (!editingPerfume) {
      return
    }

    const confirmed = window.confirm(
      `Delete "${editingPerfume.name}" permanently? This action cannot be undone.`,
    )
    if (!confirmed) {
      return
    }

    try {
      await deletePerfumeMutation(editingPerfume.id)
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Perfume deleted successfully.')
      closeEditModal()
    } catch {
      toast.error('Unable to delete perfume right now.')
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-black/70 sm:text-base">
          This area is restricted to logged in admins only.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        <AddPerfumeSection
          categories={categories}
          isLoadingCategories={isLoadingCategories}
        />

        <div className="space-y-4 lg:space-y-6">
          <AddCategorySection
            isAddingCategory={isAddingCategory}
            onCreateCategory={handleCreateCategory}
          />

          <PerfumeSearchSection
            products={products}
            isLoadingProducts={isLoadingProducts}
            onSelectPerfume={openEditModal}
          />
        </div>
      </section>

      <div className="mt-5 sm:mt-6">
        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-md bg-black px-4 py-2.5 text-sm text-white transition-opacity hover:opacity-90 sm:w-auto sm:text-base"
        >
          Logout
        </button>
      </div>

      <EditPerfumeModal
        key={editingPerfume?.id ?? 'no-perfume-selected'}
        categories={categories}
        isLoadingCategories={isLoadingCategories}
        isUpdatingPerfume={isUpdatingPerfume}
        isDeletingPerfume={isDeletingPerfume}
        perfume={editingPerfume}
        onClose={closeEditModal}
        onSubmit={handleUpdatePerfume}
        onDelete={handleDeletePerfume}
      />
    </main>
  )
}

export default AdminDashboardPage
