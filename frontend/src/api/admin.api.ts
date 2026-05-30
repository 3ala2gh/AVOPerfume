import { api } from './api'
import axios from 'axios'

export async function publishWebsite(): Promise<{ success: boolean; message: string }> {
  const token = window.localStorage.getItem('avo_admin_token')

  try {
    const { data } = await api.post<{ success: boolean; message: string }>(
      '/admin/publish-website',
      {},
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      },
    )

    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiMessage = error.response?.data?.message
      if (typeof apiMessage === 'string') {
        throw new Error(apiMessage)
      }
    }

    throw new Error('Unable to trigger website publish right now.')
  }
}
