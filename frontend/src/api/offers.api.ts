import { api } from './api'
import type { Offer } from '../types/product'

export async function listOffersFromApi(): Promise<Offer[]> {
  const { data } = await api.get<Offer[]>('/products/offers')
  return data
}

export async function createOffer(image: File): Promise<Offer> {
  const formData = new FormData()
  formData.append('image', image)

  const { data } = await api.post<Offer>('/products/offers', formData)

  return data
}

export async function deleteOffer(id: number): Promise<void> {
  await api.delete(`/products/offers/${id}`)
}
