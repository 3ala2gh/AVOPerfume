import { useMutation } from '@tanstack/react-query'
import { updateProduct } from '../api/products.api'

export function useUpdateProductMutation() {
  return useMutation({
    mutationFn: updateProduct,
  })
}
