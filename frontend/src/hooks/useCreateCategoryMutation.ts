import { useMutation } from '@tanstack/react-query'
import { createCategory } from '../api/products.api'
import type { CategoryInput } from '../types/product'

export function useCreateCategoryMutation() {
  return useMutation({
    mutationFn: (payload: CategoryInput) => createCategory(payload),
  })
}
