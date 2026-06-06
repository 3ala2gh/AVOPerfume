import { Filter, Plus, Search, ShoppingCart } from 'lucide-react'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Modal from '../components/common/Modal'
import Button from '../components/common/ui/Button'
import Input from '../components/common/ui/Input'
import Select from '../components/common/ui/Select'
import FooterSection from '../components/home/FooterSection'
import {
  getCategoryOrder,
  toPerfumes,
} from '../components/home/catalogData'
import PerfumeDetails from '../components/product/PerfumeDetails'
import { useCart } from '../hooks/useCart'
import { usePerfumeModal } from '../hooks/usePerfumeModal'
import { useProductsQuery } from '../hooks/useProductsQuery'
import {
  useShopFilters,
  type ShopGenderFilter,
  type ShopSortOption,
} from '../hooks/useShopFilters'
import { useI18n } from '../hooks/useI18n'
import {
  getCloudinarySrcSet,
  getOptimizedCloudinaryUrl,
} from '../utils/cloudinary'

function ShopPage() {
  const { data: products = [] } = useProductsQuery()
  const perfumes = useMemo(() => toPerfumes(products), [products])
  const categories = getCategoryOrder(perfumes)
  const { addToCart } = useCart()
  const { t, categoryLabel } = useI18n()

  const [showFiltersOnMobile, setShowFiltersOnMobile] = useState(true)
  const {
    search,
    setSearch,
    category: selectedCategory,
    setCategory: setSelectedCategory,
    gender,
    setGender,
    sort,
    setSort,
    filteredPerfumes,
    resetFilters,
  } = useShopFilters(perfumes)
  const {
    activePerfume,
    selectedSize,
    setSelectedSize,
    openPerfume,
    closePerfume,
  } = usePerfumeModal()

  return (
    <div className="min-h-screen bg-white text-black">
      <section className="bg-black py-14 text-white sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-3 text-3xl tracking-[0.18em] sm:text-4xl md:text-6xl">{t('shop.title')}</h1>
          <p className="text-sm tracking-wide opacity-90 sm:text-base lg:text-lg">
            {t('shop.subtitle')}
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
                  {t('common.filters')}
                </h3>
                <button
                  type="button"
                  className="text-sm opacity-60 transition-opacity hover:opacity-100 lg:hidden"
                  onClick={() => setShowFiltersOnMobile((value) => !value)}
                >
                  {showFiltersOnMobile ? t('common.hide') : t('common.show')}
                </button>
              </div>

              <div className={`space-y-6 sm:space-y-8 ${showFiltersOnMobile ? 'block' : 'hidden'} lg:block`}>
                <div>
                  <label className="mb-3 block text-sm tracking-wide opacity-60">{t('shop.search')}</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-40" />
                    <Input
                      type="text"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder={t('shop.searchPlaceholder')}
                      className="rounded-none border py-2.5 pl-10 pr-4"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm tracking-wide opacity-60">{t('common.category')}</label>
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
                        {categoryLabel(
                          category,
                          perfumes.find((perfume) => perfume.category === category)?.categoryAr,
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm tracking-wide opacity-60">{t('common.gender')}</label>
                  <Select
                    value={gender}
                    onChange={(event) => setGender(event.target.value as ShopGenderFilter)}
                    className="rounded-none border px-4 py-2.5"
                  >
                    <option value="all">{categoryLabel('All')}</option>
                    <option value="male">{t('common.male')}</option>
                    <option value="female">{t('common.female')}</option>
                    <option value="unisex">{t('common.unisex')}</option>
                  </Select>
                </div>

                <div>
                  <label className="mb-3 block text-sm tracking-wide opacity-60">{t('shop.sortBy')}</label>
                  <Select
                    value={sort}
                    onChange={(event) => setSort(event.target.value as ShopSortOption)}
                    className="rounded-none border px-4 py-2.5"
                  >
                    <option value="name">{t('shop.sortName')}</option>
                    <option value="price-low">{t('shop.sortPriceLow')}</option>
                    <option value="price-high">{t('shop.sortPriceHigh')}</option>
                  </Select>
                </div>

                <Button
                  type="button"
                  onClick={resetFilters}
                  variant="outline"
                  className="w-full rounded-none border-black px-4 py-2.5"
                >
                  {t('shop.resetFilters')}
                </Button>
              </div>
            </div>
          </aside>

          <section className="flex-1">
            <div className="mb-5 flex items-center justify-between border-b border-black/10 pb-3 sm:mb-6 sm:pb-4">
              <p className="text-sm opacity-70 sm:text-base">
                {t('shop.showingPerfumes', { count: filteredPerfumes.length })}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
              {filteredPerfumes.map((perfume) => (
                <motion.div
                  key={perfume.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group cursor-pointer text-left"
                  onClick={() => openPerfume(perfume)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      openPerfume(perfume)
                    }
                  }}
                >
                  <div className="relative mb-2 aspect-[9/16] overflow-hidden bg-gray-100 sm:mb-4">
                    <img
                      src={getOptimizedCloudinaryUrl(perfume.image, { width: 600 })}
                      srcSet={getCloudinarySrcSet(perfume.image, [300, 450, 600])}
                      sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 46vw"
                      alt={perfume.name}
                      className="h-full w-full object-cover transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                  </div>
                  <div className="mb-1 flex items-start justify-between gap-2 sm:mb-2">
                    <h4 className="line-clamp-2 text-sm tracking-wide sm:text-lg">{perfume.name}</h4>
                    <span className="shrink-0 text-sm sm:text-lg">{perfume.price} {t('common.jod')}</span>
                  </div>
                  <p className="mb-2 line-clamp-2 text-xs opacity-70 sm:mb-3 sm:text-sm">{perfume.description}</p>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs tracking-wider opacity-50">
                      {categoryLabel(perfume.category, perfume.categoryAr)}
                    </p>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        addToCart(perfume)
                      }}
                      className="inline-flex h-9 w-12 shrink-0 items-center justify-center rounded-full border border-black bg-white transition-all duration-300 hover:bg-black hover:text-white sm:h-10 sm:w-14"
                      aria-label={t('home.addNamedToCart', { name: perfume.name })}
                    >
                      <span className="relative inline-flex">
                        <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                        <Plus className="absolute left-1.5 top-0.5 h-2.5 w-2.5 sm:left-2 sm:top-1 sm:h-3 sm:w-3" />
                      </span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            {filteredPerfumes.length === 0 && (
              <div className="rounded-md border border-black/10 bg-black/[0.02] px-4 py-10 text-center">
                <p className="text-sm text-black/70 sm:text-base">{t('common.noPerfumes')}</p>
              </div>
            )}
          </section>
        </div>
      </div>

      <FooterSection />

      <Modal
        isOpen={activePerfume !== null}
        onClose={closePerfume}
        title={activePerfume?.name}
        size="xl"
      >
        {activePerfume ? (
          <PerfumeDetails
            perfume={activePerfume}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            onAddToCart={() => addToCart(activePerfume, selectedSize)}
            showGender
          />
        ) : null}
      </Modal>
    </div>
  )
}

export default ShopPage
