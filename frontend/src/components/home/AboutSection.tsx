import { Gem, Leaf, Sparkles } from 'lucide-react'
import Reveal from '../common/Reveal'
import { useI18n } from '../../hooks/useI18n'

const aboutFeatures = [
  {
    Icon: Leaf,
    titleKey: 'home.aboutPremiumTitle',
    descriptionKey: 'home.aboutPremiumDescription',
  },
  {
    Icon: Sparkles,
    titleKey: 'home.aboutArtisanTitle',
    descriptionKey: 'home.aboutArtisanDescription',
  },
  {
    Icon: Gem,
    titleKey: 'home.aboutLastingTitle',
    descriptionKey: 'home.aboutLastingDescription',
  },
]

export default function AboutSection() {
  const { t } = useI18n()

  return (
    <section id="about" className="scroll-mt-24 bg-sand py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-14 text-center sm:mb-20">
          <p className="eyebrow mb-3">{t('home.featuredCollection')}</p>
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-light leading-tight tracking-wide sm:text-5xl">
            {t('home.footerTagline')}
          </h2>
          <div className="mx-auto mt-7 h-px w-20 bg-gradient-to-r from-transparent via-champagne to-transparent" />
        </Reveal>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
          {aboutFeatures.map((feature, index) => (
            <Reveal
              key={feature.titleKey}
              delay={index * 0.12}
              className="group relative text-center md:text-start"
            >
              <span className="pointer-events-none absolute -top-6 select-none font-display text-6xl font-light text-ink/5 transition-colors duration-500 group-hover:text-champagne/20 max-md:left-1/2 max-md:-translate-x-1/2 md:-top-8 md:start-0 md:text-7xl">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="relative">
                <feature.Icon
                  className="mx-auto mb-6 h-7 w-7 text-champagne transition-transform duration-500 ease-luxe group-hover:-translate-y-1 md:mx-0"
                  strokeWidth={1.25}
                  aria-hidden="true"
                />

                <h3 className="mb-3 font-display text-xl font-normal tracking-wide sm:text-2xl">
                  {t(feature.titleKey)}
                </h3>

                <p className="text-sm font-light leading-relaxed text-ink-muted">
                  {t(feature.descriptionKey)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
