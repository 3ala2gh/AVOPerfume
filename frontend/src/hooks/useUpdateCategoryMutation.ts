import { useMutation } from '@tanstack/react-query'
import { updateCategory } from '../api/products.api'
import type { CategoryInput } from '../types/product'

type UpdateCategoryVariables = CategoryInput & {
  id: number
}

export function useUpdateCategoryMutation() {
  return useMutation({
    mutationFn: ({ id, name, nameAr }: UpdateCategoryVariables) =>
      updateCategory(id, { name, nameAr }),
  })
}
