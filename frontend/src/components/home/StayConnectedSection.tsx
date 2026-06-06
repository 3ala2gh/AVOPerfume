import { useI18n } from '../../hooks/useI18n'

export default function StayConnectedSection() {
  const { t } = useI18n()

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h3 className="mb-4 text-2xl tracking-wider sm:text-3xl">{t('home.stayConnected')}</h3>
        <p className="mb-8 text-base opacity-70 sm:text-lg">
          {t('home.stayConnectedText')}
        </p>
        <div className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
          <input
            type="email"
            placeholder={t('home.emailPlaceholder')}
            className="flex-1 border border-black/20 px-4 py-3 focus:border-black focus:outline-none"
          />
          <button
            type="button"
            className="bg-black px-8 py-3 text-white transition-colors hover:bg-black/80"
          >
            {t('home.subscribe')}
          </button>
        </div>
      </div>
    </section>
  )
}
