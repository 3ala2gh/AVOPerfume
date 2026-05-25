const aboutFeatures = [
  {
    icon: '✓',
    title: 'PREMIUM INGREDIENTS',
    description: 'Only the finest natural essences from around the world',
  },
  {
    icon: '★',
    title: 'ARTISAN CRAFTED',
    description: 'Each fragrance is carefully composed by master perfumers',
  },
  {
    icon: '♦',
    title: 'LASTING IMPRESSION',
    description: 'Long-lasting fragrances that evolve throughout the day',
  },
]

export default function AboutSection() {
  return (
    <section
      id="about"
      className="mx-auto max-w-7xl scroll-mt-20 border-t border-black/10 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-3">
        {aboutFeatures.map((feature) => (
          <div key={feature.title} className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-black sm:h-16 sm:w-16">
              <span className="text-xl sm:text-2xl">{feature.icon}</span>
            </div>

            <h4 className="mb-3 text-lg tracking-wide sm:text-xl">{feature.title}</h4>

            <p className="text-sm opacity-70 sm:text-base">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
