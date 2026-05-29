import { useQuery } from '@tanstack/react-query'
import { listCategories } from '../api/products.api'

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: listCategories,
  })
}

