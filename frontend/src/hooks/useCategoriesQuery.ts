import { useQuery } from '@tanstack/react-query'
import { listPublicCategories } from '../api/public-data.api'
import { listCategoriesFromApi } from '../api/products.api'

type CategoriesQuerySource = 'public' | 'admin'

type UseCategoriesQueryOptions = {
  source?: CategoriesQuerySource
}

export function useCategoriesQuery({ source = 'public' }: UseCategoriesQueryOptions = {}) {
  return useQuery({
    queryKey: ['categories', source],
    queryFn: source === 'admin' ? listCategoriesFromApi : listPublicCategories,
  })
}
