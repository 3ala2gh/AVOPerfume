import { useI18n } from '../../hooks/useI18n'

const aboutFeatures = [
  {
    icon: '✓',
    titleKey: 'home.aboutPremiumTitle',
    descriptionKey: 'home.aboutPremiumDescription',
  },
  {
    icon: '★',
    titleKey: 'home.aboutArtisanTitle',
    descriptionKey: 'home.aboutArtisanDescription',
  },
  {
    icon: '♦',
    titleKey: 'home.aboutLastingTitle',
    descriptionKey: 'home.aboutLastingDescription',
  },
]

export default function AboutSection() {
  const { t } = useI18n()

  return (
    <section
      id="about"
      className="mx-auto max-w-7xl scroll-mt-20 border-t border-black/10 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-3">
        {aboutFeatures.map((feature) => (
          <div key={feature.titleKey} className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-black sm:h-16 sm:w-16">
              <span className="text-xl sm:text-2xl">{feature.icon}</span>
            </div>

            <h4 className="mb-3 text-lg tracking-wide sm:text-xl">{t(feature.titleKey)}</h4>

            <p className="text-sm opacity-70 sm:text-base">{t(feature.descriptionKey)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
