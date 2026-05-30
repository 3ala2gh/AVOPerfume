import { useMutation } from '@tanstack/react-query'
import { deleteOffer } from '../api/offers.api'

export function useDeleteOfferMutation() {
  return useMutation({
    mutationFn: deleteOffer,
  })
}
