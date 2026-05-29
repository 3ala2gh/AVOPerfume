import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAdminLoginSubmit } from '../../hooks/useAdminLoginSubmit'
import { adminLoginSchema } from '../../schema/adminLogin.schema'
import type { AuthResponse, LoginPayload } from '../../types/auth'

type AdminLoginPageProps = {
  onLogin: (auth: AuthResponse) => void
}

function AdminLoginPage({ onLogin }: AdminLoginPageProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginPayload>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const onSubmit = useAdminLoginSubmit({ onLogin, setError })

  return (
    <main className="container">
      <h1>Admin Login</h1>
      <p className="lead">Sign in as admin to access dashboard routes.</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-sm space-y-4 rounded-xl border border-black/10 bg-white/90 p-5"
      >
        <div className="space-y-2">
          <label htmlFor="admin-email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            className="w-full rounded-md border border-black/20 px-3 py-2 outline-none focus:border-black"
            {...register('email')}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="admin-password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            className="w-full rounded-md border border-black/20 px-3 py-2 outline-none focus:border-black"
            {...register('password')}
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>
        {errors.root && <p className="text-sm text-red-600">{errors.root.message}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-black px-4 py-2 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </main>
  )
}

export default AdminLoginPage
