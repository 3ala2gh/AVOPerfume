import { useMutation } from '@tanstack/react-query'
import { deleteCategory } from '../api/products.api'

export function useDeleteCategoryMutation() {
  return useMutation({
    mutationFn: deleteCategory,
  })
}
