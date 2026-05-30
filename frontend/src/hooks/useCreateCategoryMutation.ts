import { useMutation } from '@tanstack/react-query'
import { createCategory } from '../api/products.api'

export function useCreateCategoryMutation() {
  return useMutation({
    mutationFn: (name: string) => createCategory(name),
  })
}
