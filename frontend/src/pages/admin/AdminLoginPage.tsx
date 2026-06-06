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
    <main className="container">
      <h1>{t('admin.loginTitle')}</h1>
      <p className="lead">{t('admin.loginSubtitle')}</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-sm space-y-4 rounded-xl border border-black/10 bg-white/90 p-5"
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
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? t('admin.loggingIn') : t('admin.login')}
        </Button>
      </form>
    </main>
  )
}

export default AdminLoginPage
