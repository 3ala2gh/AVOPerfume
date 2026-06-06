import { getCategoryOrder, type CategoryName, type Perfume } from './catalogData'
import { useI18n } from '../../hooks/useI18n'

type CategoriesSectionProps = {
  perfumes: Perfume[]
  selectedCategory: CategoryName
  onSelectCategory: (category: CategoryName) => void
}

export default function CategoriesSection({
  perfumes,
  selectedCategory,
  onSelectCategory,
}: CategoriesSectionProps) {
  const { t, categoryLabel } = useI18n()
  const categoryOrder = getCategoryOrder(perfumes)
  const categoryCards = categoryOrder.map((name) => {
    const count =
      name === 'All' ? perfumes.length : perfumes.filter((item) => item.category === name).length

    return { name, count }
  })
  const categories = [
    categoryCards[0],
    {
      name: 'Men',
      count: perfumes.filter((item) => item.gender === 'male').length,
    },
    {
      name: 'Women',
      count: perfumes.filter((item) => item.gender === 'female').length,
    },
    ...categoryCards.slice(1),
  ].filter((category) => category.count > 0)

  return (
    <section id="categories" className="scroll-mt-20 bg-black py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h3 className="mb-8 text-center text-2xl tracking-wider sm:mb-12 sm:text-4xl">
          {t('home.shopByCategory')}
        </h3>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const isActive = selectedCategory === category.name

            return (
              <button
                key={category.name}
                type="button"
                onClick={() => onSelectCategory(category.name)}
                className={`group border p-4 transition-all duration-300 sm:p-6 ${
                  isActive
                    ? 'border-white bg-white text-black'
                    : 'border-white/20 hover:bg-white hover:text-black'
                }`}
              >
                <h4 className="mb-2 text-base tracking-wide sm:text-xl">
                  {categoryLabel(
                    category.name,
                    perfumes.find((perfume) => perfume.category === category.name)?.categoryAr,
                  )}
                </h4>

                <p className="text-xs opacity-60 sm:text-sm">
                  {t('home.fragrances', { count: category.count })}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
