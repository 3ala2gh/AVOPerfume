import { api } from './api'
import type { Offer } from '../types/product'

export async function listOffersFromApi(): Promise<Offer[]> {
  const { data } = await api.get<Offer[]>('/products/offers')
  return data
}

export async function createOffer(image: File): Promise<Offer> {
  const token = window.localStorage.getItem('avo_admin_token')
  const formData = new FormData()
  formData.append('image', image)

  const { data } = await api.post<Offer>('/products/offers', formData, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  return data
}

export async function deleteOffer(id: number): Promise<void> {
  const token = window.localStorage.getItem('avo_admin_token')
  await api.delete(`/products/offers/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })
}
