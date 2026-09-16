import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Button from '../../components/common/ui/Button'
import Input from '../../components/common/ui/Input'
import { useAdminLoginSubmit } from '../../hooks/useAdminLoginSubmit'
import { adminLoginSchema } from '../../schema/adminLogin.schema'
import type { AuthResponse, LoginPayload } from '../../types/auth'
import { useI18n } from '../../hooks/useI18n'

type AdminLoginPageProps = {
  onLogin: (auth: AuthResponse) => void
}

function AdminLoginPage({ onLogin }: AdminLoginPageProps) {
  const { t } = useI18n()
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
    <main className="flex min-h-screen items-center justify-center bg-ivory px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-light tracking-wide">
            {t('admin.loginTitle')}
          </h1>
          <div className="mx-auto my-5 h-px w-16 bg-gradient-to-r from-transparent via-champagne to-transparent" />
          <p className="text-sm font-light text-ink-muted">{t('admin.loginSubtitle')}</p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 border border-ink/10 bg-white p-6 shadow-card"
        >
        <div className="space-y-2">
          <label htmlFor="admin-email" className="block text-sm font-medium">
            {t('common.email')}
          </label>
          <Input
            id="admin-email"
            type="email"
            {...register('email')}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="admin-password" className="block text-sm font-medium">
            {t('common.password')}
          </label>
          <Input
            id="admin-password"
            type="password"
            {...register('password')}
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>
          {errors.root && <p className="text-sm text-red-600">{errors.root.message}</p>}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? t('admin.loggingIn') : t('admin.login')}
          </Button>
        </form>
      </div>
    </main>
  )
}

export default AdminLoginPage
