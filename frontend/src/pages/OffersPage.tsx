import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useOffersQuery } from '../hooks/useOffersQuery'
import { useI18n } from '../hooks/useI18n'
import {
  getCloudinarySrcSet,
  getOptimizedCloudinaryUrl,
} from '../utils/cloudinary'

function OffersPage() {
  const { data: offers = [] } = useOffersQuery()
  const [activeIndex, setActiveIndex] = useState(0)
  const { t } = useI18n()

  function goNext() {
    setActiveIndex((currentIndex) => (currentIndex + 1) % offers.length)
  }

  function goPrevious() {
    setActiveIndex((currentIndex) => (currentIndex - 1 + offers.length) % offers.length)
  }

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <section className="relative overflow-hidden bg-ink py-20 text-white sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(184,146,90,0.18),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="eyebrow mb-4">{t('nav.offers')}</p>
          <h1 className="font-display text-4xl font-light tracking-wide sm:text-6xl">
            {t('offers.title')}
          </h1>
          <div className="mx-auto my-6 h-px w-20 bg-gradient-to-r from-transparent via-champagne to-transparent" />
          <p className="mx-auto max-w-lg text-sm font-light leading-relaxed text-white/60 sm:text-base">
            {t('offers.subtitle')}
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
        {offers.length === 0 ? (
          <div className="mx-auto w-full max-w-7xl border border-ink/10 bg-white px-4 py-16 text-center">
            <p className="font-display text-xl font-light text-ink-muted">
              {t('offers.empty')}
            </p>
          </div>
        ) : (
          <div className="relative mx-auto w-full max-w-[1500px] overflow-hidden bg-sand">
            <img
              src={getOptimizedCloudinaryUrl(offers[activeIndex]?.imageUrl ?? '', {
                width: 1600,
              })}
              srcSet={getCloudinarySrcSet(
                offers[activeIndex]?.imageUrl ?? '',
                [600, 900, 1200, 1600],
              )}
              sizes="100vw"
              alt={t('offers.imageAlt', { number: activeIndex + 1 })}
              className="h-[56vh] w-full object-cover sm:h-[66vh] lg:h-[78vh] lg:object-contain"
              decoding="async"
            />

            {offers.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label={t('offers.previous')}
                  onClick={goPrevious}
                  className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-white backdrop-blur-sm transition-colors hover:bg-champagne sm:left-5"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label={t('offers.next')}
                  onClick={goNext}
                  className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-white backdrop-blur-sm transition-colors hover:bg-champagne sm:right-5"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default OffersPage
