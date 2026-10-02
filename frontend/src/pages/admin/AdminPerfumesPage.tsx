import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import EditPerfumeModal, { type EditPerfumePayload } from '../../components/admin/EditPerfumeModal'
import PerfumeSearchSection from '../../components/admin/PerfumeSearchSection'
import { useCategoriesQuery } from '../../hooks/useCategoriesQuery'
import { useDeleteProductMutation } from '../../hooks/useDeleteProductMutation'
import { useProductsQuery } from '../../hooks/useProductsQuery'
import { useUpdateProductMutation } from '../../hooks/useUpdateProductMutation'
import { useI18n } from '../../hooks/useI18n'
import type { Product } from '../../types/product'

function AdminPerfumesPage() {
  const queryClient = useQueryClient()
  const { t } = useI18n()
  const { data: categories = [], isLoading: isLoadingCategories } = useCategoriesQuery({ source: 'admin' })
  const { data: products = [], isLoading: isLoadingProducts } = useProductsQuery({ source: 'admin' })
  const [editingPerfume, setEditingPerfume] = useState<Product | null>(null)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const { mutateAsync: updatePerfumeMutation, isPending: isUpdatingPerfume } = useUpdateProductMutation()
  const { mutateAsync: deletePerfumeMutation, isPending: isDeletingPerfume } = useDeleteProductMutation()

  function closeEditModal() {
    setEditingPerfume(null)
  }

  async function handleUpdatePerfume(values: EditPerfumePayload) {
    if (!editingPerfume) return

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
        is10MlEnabled: values.is10MlEnabled,
        is30MlEnabled: values.is30MlEnabled,
        is55MlEnabled: values.is55MlEnabled,
        is100MlEnabled: values.is100MlEnabled,
        image: values.image,
      })
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success(t('admin.perfumeUpdated'))
    } catch {
      toast.error(t('admin.updateError'))
    }
  }

  async function handleDeletePerfume() {
    if (!editingPerfume) return

    try {
      await deletePerfumeMutation(editingPerfume.id)
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success(t('admin.perfumeDeleted'))
      setIsConfirmingDelete(false)
      closeEditModal()
    } catch {
      toast.error(t('admin.deleteError'))
    }
  }

  return (
    <>
      <PerfumeSearchSection
        products={products}
        isLoadingProducts={isLoadingProducts}
        onSelectPerfume={setEditingPerfume}
      />

      <EditPerfumeModal
        key={editingPerfume?.id ?? 'no-perfume-selected'}
        categories={categories}
        isLoadingCategories={isLoadingCategories}
        isUpdatingPerfume={isUpdatingPerfume}
        isDeletingPerfume={isDeletingPerfume}
        perfume={editingPerfume}
        onClose={closeEditModal}
        onSubmit={handleUpdatePerfume}
        onDelete={async () => setIsConfirmingDelete(true)}
      />

      <ConfirmDialog
        isOpen={isConfirmingDelete && editingPerfume !== null}
        title={t('admin.deletePerfumeTitle')}
        message={editingPerfume ? t('admin.deleteConfirm', { name: editingPerfume.name }) : ''}
        isPending={isDeletingPerfume}
        onConfirm={() => void handleDeletePerfume()}
        onCancel={() => setIsConfirmingDelete(false)}
      />
    </>
  )
}

export default AdminPerfumesPage
