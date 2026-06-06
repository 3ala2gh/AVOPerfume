import { useI18n } from '../hooks/useI18n'

function NotFoundPage() {
  const { t } = useI18n()

  return (
    <main className="container">
      <h1>{t('notFound.title')}</h1>
      <p className="lead">{t('notFound.text')}</p>
    </main>
  )
}

export default NotFoundPage
