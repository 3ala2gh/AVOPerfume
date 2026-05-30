import { useMutation } from '@tanstack/react-query'
import { createProduct } from '../api/products.api'

export function useCreateProductMutation() {
  return useMutation({
    mutationFn: createProduct,
  })
}
