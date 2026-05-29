import { useQuery } from '@tanstack/react-query'
import { listProducts } from '../api/products.api'

export function useProductsQuery() {
  return useQuery({
    queryKey: ['products'],
    queryFn: listProducts,
  })
}

