import axios from 'axios'
import type { UseFormSetError } from 'react-hook-form'
import { login } from '../api/auth.api'
import type { AuthResponse, LoginPayload } from '../types/auth'

type UseAdminLoginSubmitParams = {
  onLogin: (auth: AuthResponse) => void
  setError: UseFormSetError<LoginPayload>
}

export function useAdminLoginSubmit({ onLogin, setError }: UseAdminLoginSubmitParams) {
  return async function onSubmit(values: LoginPayload) {
    try {
      const auth = await login(values)

      if (auth.user.role.toLowerCase() !== 'admin') {
        setError('root', {
          message: 'This account does not have admin access.',
        })
        return
      }

      onLogin(auth)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          (error.response?.data as { message?: string } | undefined)?.message ??
          'Unable to login right now. Please try again.'

        setError('root', { message })
        return
      }

      setError('root', {
        message: 'Unexpected error happened. Please try again.',
      })
    }
  }
}
