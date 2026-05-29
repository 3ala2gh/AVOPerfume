import { useEffect, useState } from 'react'
import type { AuthResponse } from '../types/auth'

const ADMIN_AUTH_TOKEN_KEY = 'avo_admin_token'
const ADMIN_AUTH_USER_KEY = 'avo_admin_user'

function isTokenExpired(token: string): boolean {
  try {
    const [, payload] = token.split('.')
    if (!payload) {
      return true
    }

    const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number }
    if (!decodedPayload.exp) {
      return false
    }

    const nowInSeconds = Math.floor(Date.now() / 1000)
    return decodedPayload.exp <= nowInSeconds
  } catch {
    return true
  }
}

function isStoredAdminSessionValid(): boolean {
  const token = window.localStorage.getItem(ADMIN_AUTH_TOKEN_KEY)
  const user = window.localStorage.getItem(ADMIN_AUTH_USER_KEY)

  if (!token || !user) {
    return false
  }

  return !isTokenExpired(token)
}

export function useAdminSession() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => isStoredAdminSessionValid())

  useEffect(() => {
    if (!isStoredAdminSessionValid()) {
      window.localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY)
      window.localStorage.removeItem(ADMIN_AUTH_USER_KEY)
      setIsAdminAuthenticated(false)
    }
  }, [])

  const login = (auth: AuthResponse) => {
    window.localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, auth.token)
    window.localStorage.setItem(ADMIN_AUTH_USER_KEY, JSON.stringify(auth.user))
    setIsAdminAuthenticated(true)
  }

  const logout = () => {
    window.localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY)
    window.localStorage.removeItem(ADMIN_AUTH_USER_KEY)
    setIsAdminAuthenticated(false)
  }

  return {
    isAdminAuthenticated,
    login,
    logout,
  }
}

