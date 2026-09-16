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

export async function updateBestSellers(perfumeIds: number[]) {
  const { data } = await api.put<{ success: boolean; updatedCount: number }>(
    '/admin/best-sellers',
    { perfumeIds },
  )
  return data
}

export type SizeSettings = {
  is10MlEnabled: boolean
  is30MlEnabled: boolean
  is55MlEnabled: boolean
  is100MlEnabled: boolean
}

export async function getSizeSettings(): Promise<SizeSettings> {
  const { data } = await api.get<SizeSettings>('/admin/size-settings')
  return data
}

export async function updateSizeSettings(payload: SizeSettings): Promise<SizeSettings> {
  const { data } = await api.put<SizeSettings>('/admin/size-settings', payload)
  return data
}
