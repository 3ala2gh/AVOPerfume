import { Link } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'

function NotFoundPage() {
  const { t } = useI18n()

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-ivory px-4 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-display text-4xl font-light tracking-wide sm:text-5xl">
        {t('notFound.title')}
      </h1>
      <div className="my-6 h-px w-20 bg-gradient-to-r from-transparent via-champagne to-transparent" />
      <p className="mb-8 max-w-md text-sm font-light leading-relaxed text-ink-muted">
        {t('notFound.text')}
      </p>
      <Link
        to="/"
        className="inline-block border border-ink/20 px-8 py-3.5 text-[11px] font-medium uppercase tracking-luxe text-ink no-underline transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white"
      >
        {t('common.backHome')}
      </Link>
    </main>
  )
}

export default NotFoundPage
