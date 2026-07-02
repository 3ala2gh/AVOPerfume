import { useMutation } from '@tanstack/react-query'
import { updateBestSellers } from '../api/admin.api'

export function useUpdateBestSellersMutation() {
  return useMutation({ mutationFn: updateBestSellers })
}
