import { useMutation } from '@tanstack/react-query'
import { deleteProduct } from '../api/products.api'

export function useDeleteProductMutation() {
  return useMutation({
    mutationFn: deleteProduct,
  })
}
