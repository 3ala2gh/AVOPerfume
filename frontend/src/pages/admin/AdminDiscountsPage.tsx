import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import DiscountManagementSection from '../../components/admin/DiscountManagementSection'
import { useApplyDiscountMutation } from '../../hooks/useApplyDiscountMutation'
import { useProductsQuery } from '../../hooks/useProductsQuery'
import { useI18n } from '../../hooks/useI18n'

function AdminDiscountsPage() {
  const queryClient = useQueryClient()
  const { t } = useI18n()
  const { data: products = [], isLoading } = useProductsQuery({ source: 'admin' })
  const { mutateAsync: applyDiscount, isPending } = useApplyDiscountMutation()

  async function handleApplyDiscount(discountPercent: number, applyToAll: boolean, perfumeIds: number[]) {
    const result = await applyDiscount({ discountPercent, applyToAll, perfumeIds })
    await queryClient.invalidateQueries({ queryKey: ['products'] })
    toast.success(t('admin.discountUpdated', { count: result.updatedCount }))
  }

  return (
    <DiscountManagementSection
      products={products}
      isLoading={isLoading}
      isSaving={isPending}
      onSave={handleApplyDiscount}
    />
  )
}

export default AdminDiscountsPage
