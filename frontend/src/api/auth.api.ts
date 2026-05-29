import { api } from './api'
import type { AuthResponse, LoginPayload } from '../types/auth'

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', payload)
  return data
}
