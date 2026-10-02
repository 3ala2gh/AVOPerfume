import AddPerfumeSection from '../../components/admin/AddPerfumeSection'
import { useCategoriesQuery } from '../../hooks/useCategoriesQuery'

function AdminAddPerfumePage() {
  const { data: categories = [], isLoading } = useCategoriesQuery({ source: 'admin' })

  return <AddPerfumeSection categories={categories} isLoadingCategories={isLoading} />
}

export default AdminAddPerfumePage
