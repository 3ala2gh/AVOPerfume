import { useQuery } from '@tanstack/react-query'
import { listPublicOffers } from '../api/public-data.api'
import { listOffersFromApi } from '../api/offers.api'

type OffersQuerySource = 'public' | 'admin'

type UseOffersQueryOptions = {
  source?: OffersQuerySource
}

export function useOffersQuery({ source = 'public' }: UseOffersQueryOptions = {}) {
  return useQuery({
    queryKey: ['offers', source],
    queryFn: source === 'admin' ? listOffersFromApi : listPublicOffers,
  })
}
