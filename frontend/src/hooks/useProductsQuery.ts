import { useQuery } from '@tanstack/react-query'
import { listPublicProducts } from '../api/public-data.api'
import { listProductsFromApi } from '../api/products.api'

type ProductsQuerySource = 'public' | 'admin'

type UseProductsQueryOptions = {
  source?: ProductsQuerySource
}

export function useProductsQuery({ source = 'public' }: UseProductsQueryOptions = {}) {
  return useQuery({
    queryKey: ['products', source],
    queryFn: source === 'admin' ? listProductsFromApi : listPublicProducts,
  })
}
