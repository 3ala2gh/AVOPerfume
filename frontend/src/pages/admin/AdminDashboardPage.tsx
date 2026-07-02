import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import CategoryManagementSection from '../../components/admin/CategoryManagementSection'
import DiscountManagementSection from '../../components/admin/DiscountManagementSection'
import BestSellerManagementSection from '../../components/admin/BestSellerManagementSection'
import AddPerfumeSection from '../../components/admin/AddPerfumeSection'
import EditPerfumeModal, {
  type EditPerfumePayload,
} from '../../components/admin/EditPerfumeModal'
import PerfumeSearchSection from '../../components/admin/PerfumeSearchSection'
import AdminCollapsibleSection from '../../components/admin/AdminCollapsibleSection'
import { useCategoriesQuery } from '../../hooks/useCategoriesQuery'
import { useApplyDiscountMutation } from '../../hooks/useApplyDiscountMutation'
import { useUpdateBestSellersMutation } from '../../hooks/useUpdateBestSellersMutation'
import { useCreateCategoryMutation } from '../../hooks/useCreateCategoryMutation'
import { useDeleteProductMutation } from '../../hooks/useDeleteProductMutation'
import { useDeleteCategoryMutation } from '../../hooks/useDeleteCategoryMutation'
import { usePublishWebsiteMutation } from '../../hooks/usePublishWebsiteMutation'
import { useProductsQuery } from '../../hooks/useProductsQuery'
import { useUpdateProductMutation } from '../../hooks/useUpdateProductMutation'
import { useUpdateCategoryMutation } from '../../hooks/useUpdateCategoryMutation'
import type { Category, CategoryInput, Product } from '../../types/product'
import { useI18n } from '../../hooks/useI18n'

type AdminDashboardPageProps = {
  onLogout: () => void
}

function AdminDashboardPage({ onLogout }: AdminDashboardPageProps) {
  const queryClient = useQueryClient()
  const { t } = useI18n()
  const { data: categories = [], isLoading: isLoadingCategories } = useCategoriesQuery({
    source: 'admin',
  })
  const { data: products = [], isLoading: isLoadingProducts } = useProductsQuery({
    source: 'admin',
  })
  const [editingPerfume, setEditingPerfume] = useState<Product | null>(null)

  const { mutateAsync: createCategoryMutation, isPending: isAddingCategory } =
    useCreateCategoryMutation()
  const { mutateAsync: updateCategoryMutation, isPending: isUpdatingCategory } =
    useUpdateCategoryMutation()
  const { mutateAsync: deleteCategoryMutation, isPending: isDeletingCategory } =
    useDeleteCategoryMutation()
  const { mutateAsync: updatePerfumeMutation, isPending: isUpdatingPerfume } =
    useUpdateProductMutation()
  const { mutateAsync: deletePerfumeMutation, isPending: isDeletingPerfume } =
    useDeleteProductMutation()
  const { mutateAsync: publishWebsiteMutation, isPending: isPublishingWebsite } =
    usePublishWebsiteMutation()
  const { mutateAsync: applyDiscountMutation, isPending: isApplyingDiscount } = useApplyDiscountMutation()
  const { mutateAsync: updateBestSellersMutation, isPending: isUpdatingBestSellers } = useUpdateBestSellersMutation()

  async function refreshCategoryData() {
    await queryClient.invalidateQueries({ queryKey: ['categories'] })
    await queryClient.invalidateQueries({ queryKey: ['products'] })
  }

  async function handleCreateCategory(payload: CategoryInput) {
    await createCategoryMutation(payload)
    await refreshCategoryData()
    toast.success(t('admin.categoryCreated'))
  }

  async function handleUpdateCategory(id: number, payload: CategoryInput) {
    await updateCategoryMutation({ id, ...payload })
    await refreshCategoryData()
    toast.success(t('admin.categoryUpdated'))
  }

  async function handleDeleteCategory(category: Category) {
    const confirmed = window.confirm(
      t('admin.deleteCategoryConfirm', { name: category.name }),
    )
    if (!confirmed) return

    await deleteCategoryMutation(category.id)
    await refreshCategoryData()
    toast.success(t('admin.categoryDeleted'))
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
        price10Ml: values.price10Ml,
        price30Ml: values.price30Ml,
        price55Ml: values.price55Ml,
        price100Ml: values.price100Ml,
        image: values.image,
      })
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success(t('admin.perfumeUpdated'))
    } catch {
      toast.error(t('admin.updateError'))
    }
  }

  async function handleDeletePerfume() {
    if (!editingPerfume) {
      return
    }

    const confirmed = window.confirm(
      t('admin.deleteConfirm', { name: editingPerfume.name }),
    )
    if (!confirmed) {
      return
    }

    try {
      await deletePerfumeMutation(editingPerfume.id)
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success(t('admin.perfumeDeleted'))
      closeEditModal()
    } catch {
      toast.error(t('admin.deleteError'))
    }
  }

  async function handlePublishWebsite() {
    try {
      await publishWebsiteMutation()
      toast.success(t('admin.publishTriggered'))
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t('admin.publishError')
      toast.error(message)
    }
  }

  async function handleApplyDiscount(discountPercent: number, applyToAll: boolean, perfumeIds: number[]) {
    const result = await applyDiscountMutation({ discountPercent, applyToAll, perfumeIds })
    await queryClient.invalidateQueries({ queryKey: ['products'] })
    toast.success(`Discount updated for ${result.updatedCount} perfume${result.updatedCount === 1 ? '' : 's'}. Publish the website when ready.`)
  }

  async function handleUpdateBestSellers(perfumeIds: number[]) {
    await updateBestSellersMutation(perfumeIds)
    await queryClient.invalidateQueries({ queryKey: ['products'] })
    toast.success('Best sellers updated. Publish the website when ready.')
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-white/10 bg-black text-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-1 text-2xl tracking-wider">{t('brand')}</h1>
              <p className="text-sm opacity-60">{t('admin.productsDashboard')}</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/admin/offers"
                className="flex items-center gap-2 border border-white/20 px-4 py-2 transition-colors hover:bg-white/10"
              >
                {t('admin.offers')}
              </Link>
              <Link
                to="/"
                className="flex items-center gap-2 bg-white px-4 py-2 text-black transition-colors hover:bg-white/90"
              >
                <Home className="h-4 w-4" />
                {t('common.viewStore')}
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
            <CategoryManagementSection
              categories={categories}
              isLoading={isLoadingCategories}
              isCreating={isAddingCategory}
              isUpdating={isUpdatingCategory}
              isDeleting={isDeletingCategory}
              onCreate={handleCreateCategory}
              onUpdate={handleUpdateCategory}
              onDelete={handleDeleteCategory}
            />

            <DiscountManagementSection products={products} isLoading={isLoadingProducts} isSaving={isApplyingDiscount} onSave={handleApplyDiscount} />

            {isLoadingProducts ? (
              <AdminCollapsibleSection
                title="Best Sellers"
                description="Choose and order up to 6 homepage products."
              >
                <p className="text-sm text-black/50">Loading best sellers...</p>
              </AdminCollapsibleSection>
            ) : (
              <BestSellerManagementSection
                products={products}
                isLoading={false}
                isSaving={isUpdatingBestSellers}
                onSave={handleUpdateBestSellers}
              />
            )}

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
            {isPublishingWebsite ? t('admin.publishing') : t('admin.publishWebsite')}
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="w-full rounded-md bg-black px-4 py-2.5 text-sm text-white transition-opacity hover:opacity-90 sm:w-auto sm:text-base"
          >
            {t('admin.logout')}
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
