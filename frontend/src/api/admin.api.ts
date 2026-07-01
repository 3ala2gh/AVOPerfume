import { api } from './api'
import axios from 'axios'

export async function publishWebsite(): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await api.post<{ success: boolean; message: string }>(
      '/admin/publish-website',
      {},
    )

    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiMessage = error.response?.data?.message
      if (typeof apiMessage === 'string') {
        throw new Error(apiMessage, { cause: error })
      }
    }

    throw new Error('Unable to trigger website publish right now.', { cause: error })
  }
}

export type ApplyDiscountInput = {
  discountPercent: number
  applyToAll: boolean
  perfumeIds: number[]
}

export async function applyDiscount(payload: ApplyDiscountInput) {
  const { data } = await api.put<{ success: boolean; updatedCount: number }>('/admin/discount', payload)
  return data
}
