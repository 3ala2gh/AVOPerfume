import { useMutation } from '@tanstack/react-query'
import { createOffer } from '../api/offers.api'

export function useCreateOfferMutation() {
  return useMutation({
    mutationFn: createOffer,
  })
}
