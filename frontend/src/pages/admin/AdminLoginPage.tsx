import { useState } from 'react'
import { Link } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ArrowLeft, CircleAlert, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import Input from '../../components/common/ui/Input'
import AdminButton from '../../components/admin/AdminButton'
import AdminField from '../../components/admin/AdminField'
import { useAdminLoginSubmit } from '../../hooks/useAdminLoginSubmit'
import { adminLoginSchema } from '../../schema/adminLogin.schema'
import type { AuthResponse, LoginPayload } from '../../types/auth'
import { useI18n } from '../../hooks/useI18n'

type AdminLoginPageProps = {
  onLogin: (auth: AuthResponse) => void
}

function AdminLoginPage({ onLogin }: AdminLoginPageProps) {
  const { t } = useI18n()
  const [showPassword, setShowPassword] = useState(false)
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
    <main className="admin-ui grid min-h-screen bg-ivory lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel — desktop only */}
      <aside className="relative hidden overflow-hidden bg-ink text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute -end-32 -top-32 h-96 w-96 rounded-full bg-champagne/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -start-20 h-96 w-96 rounded-full bg-champagne/10 blur-3xl" />

        <div className="relative">
          <p className="font-display text-2xl tracking-luxe">{t('brand')}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-champagne-light">
            {t('admin.adminPanel')}
          </p>
        </div>

        <div className="relative max-w-md">
          <h2 className="font-display text-5xl font-light leading-tight">{t('admin.brandTagline')}</h2>
          <div className="my-6 h-px w-20 bg-gradient-to-r from-champagne to-transparent" />
          <p className="text-base leading-relaxed text-white/65">{t('admin.brandPanelText')}</p>
        </div>

        <p className="relative text-xs text-white/40">© {new Date().getFullYear()} {t('brand')}</p>
      </aside>

      {/* Form */}
      <section className="flex flex-col px-4 py-8 sm:px-8">
        <Link
          to="/"
          className="inline-flex w-fit items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:bg-sand hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t('admin.backToStore')}
        </Link>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <div className="mb-8 text-center lg:text-start">
              <p className="mb-6 font-display text-2xl tracking-luxe text-ink lg:hidden">{t('brand')}</p>
              <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{t('admin.loginWelcome')}</h1>
              <p className="mt-2 text-sm text-ink-muted">{t('admin.loginSubtitle')}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {errors.root ? (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
                >
                  <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                  {errors.root.message}
                </div>
              ) : null}

              <AdminField label={t('common.email')} htmlFor="admin-email" error={errors.email?.message}>
                <div className="relative">
                  <Mail className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                  <Input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    placeholder={t('admin.emailPlaceholder')}
                    aria-invalid={Boolean(errors.email)}
                    className="ps-10"
                    {...register('email')}
                  />
                </div>
              </AdminField>

              <AdminField label={t('common.password')} htmlFor="admin-password" error={errors.password?.message}>
                <div className="relative">
                  <Lock className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                  <Input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder={t('admin.passwordPlaceholder')}
                    aria-invalid={Boolean(errors.password)}
                    className="pe-11 ps-10"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? t('admin.hidePassword') : t('admin.showPassword')}
                    className="absolute end-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-ink/50 transition-colors hover:bg-sand hover:text-ink"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </AdminField>

              <AdminButton type="submit" isLoading={isSubmitting} className="w-full">
                {isSubmitting ? t('admin.loggingIn') : t('admin.login')}
              </AdminButton>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AdminLoginPage
