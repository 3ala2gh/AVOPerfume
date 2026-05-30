import { Filter, Search } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Modal from '../components/common/Modal'
import Button from '../components/common/ui/Button'
import Input from '../components/common/ui/Input'
import Select from '../components/common/ui/Select'
import FooterSection from '../components/home/FooterSection'
import { getCategoryOrder, toPerfumes, type Perfume } from '../components/home/catalogData'
import { useCart } from '../context/cart-context'
import { useProductsQuery } from '../hooks/useProductsQuery'

type SortOption = 'name' | 'price-low' | 'price-high'
type GenderFilter = 'all' | 'male' | 'female' | 'unisex'

function ShopPage() {
  const { data: products = [] } = useProductsQuery()
  const perfumes = toPerfumes(products)
  const categories = getCategoryOrder(perfumes)
  const { addToCart } = useCart()

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedGender, setSelectedGender] = useState<GenderFilter>('all')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [showFiltersOnMobile, setShowFiltersOnMobile] = useState(true)
  const [activePerfume, setActivePerfume] = useState<Perfume | null>(null)

  const filteredPerfumes = (() => {
    const normalizedSearch = search.trim().toLowerCase()
    let result = perfumes

    if (selectedCategory !== 'All') {
      result = result.filter((perfume) => perfume.category === selectedCategory)
    }

    if (selectedGender !== 'all') {
      result = result.filter((perfume) => perfume.gender === selectedGender)
    }

    if (normalizedSearch) {
      result = result.filter((perfume) => {
        const haystack = `${perfume.name} ${perfume.description} ${perfume.category} ${perfume.gender}`.toLowerCase()
        return haystack.includes(normalizedSearch)
      })
    }

    const sorted = [...result]
    if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'price-low') {
      sorted.sort((a, b) => a.price - b.price)
    } else {
      sorted.sort((a, b) => b.price - a.price)
    }

    return sorted
  })()

  function resetFilters() {
    setSearch('')
    setSelectedCategory('All')
    setSelectedGender('all')
    setSortBy('name')
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <section className="bg-black py-14 text-white sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-3 text-3xl tracking-[0.18em] sm:text-4xl md:text-6xl">ALL PERFUMES</h1>
          <p className="text-sm tracking-wide opacity-90 sm:text-base lg:text-lg">
            Explore our complete collection
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <aside className="lg:w-64 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-20">
              <div className="mb-4 flex items-center justify-between sm:mb-6">
                <h3 className="flex items-center gap-2 text-lg tracking-wide sm:text-xl">
                  <Filter className="h-5 w-5" />
                  FILTERS
                </h3>
                <button
                  type="button"
                  className="text-sm opacity-60 transition-opacity hover:opacity-100 lg:hidden"
                  onClick={() => setShowFiltersOnMobile((value) => !value)}
                >
                  {showFiltersOnMobile ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className={`space-y-6 sm:space-y-8 ${showFiltersOnMobile ? 'block' : 'hidden'} lg:block`}>
                <div>
                  <label className="mb-3 block text-sm tracking-wide opacity-60">SEARCH</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-40" />
                    <Input
                      type="text"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search..."
                      className="rounded-none border py-2.5 pl-10 pr-4"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm tracking-wide opacity-60">CATEGORY</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full border px-3 py-2 text-left text-sm transition-all sm:px-4 sm:text-base ${
                          selectedCategory === category
                            ? 'border-black bg-black text-white'
                            : 'border-black/20 hover:border-black'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm tracking-wide opacity-60">GENDER</label>
                  <Select
                    value={selectedGender}
                    onChange={(event) => setSelectedGender(event.target.value as GenderFilter)}
                    className="rounded-none border px-4 py-2.5"
                  >
                    <option value="all">All</option>
                    <option value="male">Men</option>
                    <option value="female">Women</option>
                    <option value="unisex">Unisex</option>
                  </Select>
                </div>

                <div>
                  <label className="mb-3 block text-sm tracking-wide opacity-60">SORT BY</label>
                  <Select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortOption)}
                    className="rounded-none border px-4 py-2.5"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="price-low">Price (Low to High)</option>
                    <option value="price-high">Price (High to Low)</option>
                  </Select>
                </div>

                <Button
                  type="button"
                  onClick={resetFilters}
                  variant="outline"
                  className="w-full rounded-none border-black px-4 py-2.5"
                >
                  RESET FILTERS
                </Button>
              </div>
            </div>
          </aside>

          <section className="flex-1">
            <div className="mb-5 flex items-center justify-between border-b border-black/10 pb-3 sm:mb-6 sm:pb-4">
              <p className="text-sm opacity-70 sm:text-base">
                Showing <span className="font-semibold">{filteredPerfumes.length}</span> perfumes
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
              {filteredPerfumes.map((perfume) => (
                <motion.button
                  key={perfume.id}
                  type="button"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group cursor-pointer text-left"
                  onClick={() => setActivePerfume(perfume)}
                >
                  <div className="relative mb-2 aspect-[3/4] overflow-hidden bg-gray-100 p-1 sm:mb-4">
                    <img
                      src={perfume.image}
                      alt={perfume.name}
                      className="h-full w-full object-contain transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                  </div>
                  <div className="mb-1 flex items-start justify-between gap-2 sm:mb-2">
                    <h4 className="line-clamp-2 text-sm tracking-wide sm:text-lg">{perfume.name}</h4>
                    <span className="shrink-0 text-sm sm:text-lg">{perfume.price} JOD</span>
                  </div>
                  <p className="mb-1 line-clamp-2 text-xs opacity-70 sm:mb-2 sm:text-sm">{perfume.description}</p>
                  <p className="text-xs tracking-wider opacity-50">{perfume.category}</p>
                </motion.button>
              ))}
            </div>
            {filteredPerfumes.length === 0 && (
              <div className="rounded-md border border-black/10 bg-black/[0.02] px-4 py-10 text-center">
                <p className="text-sm text-black/70 sm:text-base">No perfumes match your filters.</p>
              </div>
            )}
          </section>
        </div>
      </div>

      <FooterSection />

      <Modal
        isOpen={activePerfume !== null}
        onClose={() => setActivePerfume(null)}
        title={activePerfume?.name}
        size="lg"
      >
        {activePerfume ? (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative flex min-h-[170px] items-center justify-center bg-gray-100 p-1 sm:min-h-[210px] md:min-h-[360px]">
                <img
                  src={activePerfume.image}
                  alt={activePerfume.name}
                  className="max-h-[160px] w-full object-contain sm:max-h-[200px] md:max-h-[340px]"
                />
              </div>
              <div className="p-6 md:p-10">
                <div className="mb-6">
                  <p className="mb-2 text-xs tracking-[0.18em] uppercase text-black/50">
                    {activePerfume.category}
                  </p>
                  <p className="mb-3 text-xs tracking-[0.16em] uppercase text-black/45">
                    {activePerfume.gender}
                  </p>
                  <h2 className="mb-4 text-3xl tracking-wide md:text-4xl">
                    {activePerfume.name}
                  </h2>
                  <p className="mb-6 text-2xl tracking-wide md:text-3xl">
                    {activePerfume.price} JOD
                  </p>
                  <p className="text-base leading-relaxed text-black/70 md:text-lg">
                    {activePerfume.description}
                  </p>
                </div>
                <div className="space-y-3">
                <Button
                  type="button"
                  onClick={() => addToCart(activePerfume)}
                  className="w-full rounded-none py-4 tracking-wide"
                >
                  Add to Cart
                </Button>
                </div>
              </div>
            </div>
          </AnimatePresence>
        ) : null}
      </Modal>
    </div>
  )
}

export default ShopPage
