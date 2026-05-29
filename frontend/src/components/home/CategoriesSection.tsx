import { getCategoryOrder, type CategoryName, type Perfume } from './catalogData'

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
  const categoryOrder = getCategoryOrder(perfumes)
  const categories = categoryOrder.map((name) => {
    const count =
      name === 'All' ? perfumes.length : perfumes.filter((item) => item.category === name).length

    return { name, count }
  })

  return (
    <section id="categories" className="scroll-mt-20 bg-black py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h3 className="mb-8 text-center text-2xl tracking-wider sm:mb-12 sm:text-4xl">
          SHOP BY CATEGORY
        </h3>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
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
                <h4 className="mb-2 text-base tracking-wide sm:text-xl">{category.name}</h4>

                <p className="text-xs opacity-60 sm:text-sm">{category.count} fragrances</p>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
