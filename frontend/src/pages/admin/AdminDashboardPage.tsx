import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
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
import { usePublishWebsiteMutation } from '../../hooks/usePublishWebsiteMutation'
import { useProductsQuery } from '../../hooks/useProductsQuery'
import { useUpdateProductMutation } from '../../hooks/useUpdateProductMutation'
import type { Product } from '../../types/product'

type AdminDashboardPageProps = {
  onLogout: () => void
}

function AdminDashboardPage({ onLogout }: AdminDashboardPageProps) {
  const queryClient = useQueryClient()
  const { data: categories = [], isLoading: isLoadingCategories } = useCategoriesQuery({
    source: 'admin',
  })
  const { data: products = [], isLoading: isLoadingProducts } = useProductsQuery({
    source: 'admin',
  })
  const [editingPerfume, setEditingPerfume] = useState<Product | null>(null)

  const { mutateAsync: createCategoryMutation, isPending: isAddingCategory } =
    useCreateCategoryMutation()
  const { mutateAsync: updatePerfumeMutation, isPending: isUpdatingPerfume } =
    useUpdateProductMutation()
  const { mutateAsync: deletePerfumeMutation, isPending: isDeletingPerfume } =
    useDeleteProductMutation()
  const { mutateAsync: publishWebsiteMutation, isPending: isPublishingWebsite } =
    usePublishWebsiteMutation()

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

  async function handlePublishWebsite() {
    try {
      await publishWebsiteMutation()
      toast.success('Website publish triggered successfully.')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to trigger website publish right now.'
      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-white/10 bg-black text-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-1 text-2xl tracking-wider">AVO PERFUMES</h1>
              <p className="text-sm opacity-60">Admin Dashboard - Products</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/admin/offers"
                className="flex items-center gap-2 border border-white/20 px-4 py-2 transition-colors hover:bg-white/10"
              >
                Offers
              </Link>
              <Link
                to="/"
                className="flex items-center gap-2 bg-white px-4 py-2 text-black transition-colors hover:bg-white/90"
              >
                <Home className="h-4 w-4" />
                View Store
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
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
            onClick={handlePublishWebsite}
            disabled={isPublishingWebsite}
            className="w-full rounded-md border border-black px-4 py-2.5 text-sm text-black transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:mr-3 sm:w-auto sm:text-base"
          >
            {isPublishingWebsite ? 'Publishing...' : 'Publish Website'}
          </button>
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
    </div>
  )
}

export default AdminDashboardPage
