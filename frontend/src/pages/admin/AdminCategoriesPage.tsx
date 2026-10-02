import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import CategoryManagementSection from '../../components/admin/CategoryManagementSection'
import { useCategoriesQuery } from '../../hooks/useCategoriesQuery'
import { useCreateCategoryMutation } from '../../hooks/useCreateCategoryMutation'
import { useDeleteCategoryMutation } from '../../hooks/useDeleteCategoryMutation'
import { useUpdateCategoryMutation } from '../../hooks/useUpdateCategoryMutation'
import { useI18n } from '../../hooks/useI18n'
import type { Category, CategoryInput } from '../../types/product'

function AdminCategoriesPage() {
  const queryClient = useQueryClient()
  const { t } = useI18n()
  const { data: categories = [], isLoading } = useCategoriesQuery({ source: 'admin' })
  const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategoryMutation()
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategoryMutation()
  const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategoryMutation()

  async function refreshCategoryData() {
    await queryClient.invalidateQueries({ queryKey: ['categories'] })
    await queryClient.invalidateQueries({ queryKey: ['products'] })
  }

  async function handleCreate(payload: CategoryInput) {
    await createCategory(payload)
    await refreshCategoryData()
    toast.success(t('admin.categoryCreated'))
  }

  async function handleUpdate(id: number, payload: CategoryInput) {
    await updateCategory({ id, ...payload })
    await refreshCategoryData()
    toast.success(t('admin.categoryUpdated'))
  }

  async function handleDelete(category: Category) {
    await deleteCategory(category.id)
    await refreshCategoryData()
    toast.success(t('admin.categoryDeleted'))
  }

  return (
    <CategoryManagementSection
      categories={categories}
      isLoading={isLoading}
      isCreating={isCreating}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  )
}

export default AdminCategoriesPage
