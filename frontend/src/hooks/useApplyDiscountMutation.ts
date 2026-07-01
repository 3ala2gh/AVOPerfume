import { useMutation } from '@tanstack/react-query'
import { applyDiscount } from '../api/admin.api'

export function useApplyDiscountMutation() {
  return useMutation({ mutationFn: applyDiscount })
}
