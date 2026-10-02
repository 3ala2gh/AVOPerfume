import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import BestSellerManagementSection from '../../components/admin/BestSellerManagementSection'
import { AdminListSkeleton } from '../../components/admin/AdminEmptyState'
import { useProductsQuery } from '../../hooks/useProductsQuery'
import { useUpdateBestSellersMutation } from '../../hooks/useUpdateBestSellersMutation'
import { useI18n } from '../../hooks/useI18n'

function AdminBestSellersPage() {
  const queryClient = useQueryClient()
  const { t } = useI18n()
  const { data: products = [], isLoading } = useProductsQuery({ source: 'admin' })
  const { mutateAsync: updateBestSellers, isPending } = useUpdateBestSellersMutation()

  async function handleSave(perfumeIds: number[]) {
    await updateBestSellers(perfumeIds)
    await queryClient.invalidateQueries({ queryKey: ['products'] })
    toast.success(t('admin.bestSellersUpdated'))
  }

  // The section seeds its selection from `products` once, so wait for data before mounting it.
  if (isLoading) {
    return <AdminListSkeleton rows={6} />
  }

  return (
    <BestSellerManagementSection
      products={products}
      isLoading={false}
      isSaving={isPending}
      onSave={handleSave}
    />
  )
}

export default AdminBestSellersPage
