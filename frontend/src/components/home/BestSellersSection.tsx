import { ArrowRight, Plus, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Modal from '../common/Modal'
import PerfumeDetails from '../product/PerfumeDetails'
import SaleBadge from '../product/SaleBadge'
import SalePrice from '../product/SalePrice'
import { useCart } from '../../hooks/useCart'
import { useI18n } from '../../hooks/useI18n'
import { usePerfumeModal } from '../../hooks/usePerfumeModal'
import { getCloudinarySrcSet, getOptimizedCloudinaryUrl } from '../../utils/cloudinary'
import type { Perfume } from './catalogData'

type Props = {
  perfumes: Perfume[]
}

export default function BestSellersSection({ perfumes }: Props) {
  const { addToCart } = useCart()
  const { t, categoryLabel } = useI18n()
  const bestSellers = perfumes
    .filter((perfume) => perfume.isBestSeller)
    .sort((a, b) => (a.bestSellerRank ?? 99) - (b.bestSellerRank ?? 99))
  const {
    activePerfume,
    selectedSize,
    setSelectedSize,
    openPerfume,
    closePerfume,
  } = usePerfumeModal()

  if (bestSellers.length === 0) return null

  return (
    <section id="best-sellers" className="bg-[#f3efe8] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-5 sm:mb-10">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-black/50">
              {t('home.customerFavorites')}
            </p>
            <h2 className="text-2xl tracking-wider sm:text-4xl">{t('home.bestSellers')}</h2>
            <p className="mt-2 max-w-xl text-sm text-black/60 sm:text-base">
              {t('home.bestSellersSubtitle')}
            </p>
          </div>
          <Link
            to="/shop"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hidden shrink-0 items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold tracking-wide text-white shadow-sm transition-all hover:bg-black/75 active:scale-[0.98] sm:inline-flex"
          >
            {t('home.viewAllPerfumes')}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:gap-5 sm:px-6 lg:mx-0 lg:px-0">
          {bestSellers.map((perfume, index) => (
            <motion.article
              key={perfume.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.24) }}
              onClick={() => openPerfume(perfume)}
              className="group min-w-[78%] cursor-pointer snap-start sm:min-w-[42%] lg:min-w-[calc(25%-0.95rem)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#faf8f4] shadow-[0_1px_0_rgba(0,0,0,0.06)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                <span className="absolute left-3 top-3 z-10 rounded-full bg-black px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                  {t('home.bestSellerBadge')}
                </span>
                <span className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white/90 text-xs font-semibold backdrop-blur">
                  #{perfume.bestSellerRank ?? index + 1}
                </span>
                <SaleBadge discountPercent={perfume.discountPercent} className="absolute bottom-3 left-3 z-10" />
                <img
                  src={getOptimizedCloudinaryUrl(perfume.image, { width: 700 })}
                  srcSet={getCloudinarySrcSet(perfume.image, [400, 600, 800])}
                  sizes="(min-width: 1024px) 24vw, (min-width: 640px) 42vw, 78vw"
                  alt={perfume.name}
                  className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04] sm:p-7"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="px-1 pt-4">
                <p className="text-xs uppercase tracking-[0.16em] text-black/45">
                  {categoryLabel(perfume.category, perfume.categoryAr)}
                </p>
                <h3 className="mt-1 line-clamp-1 text-base font-medium sm:text-lg">{perfume.name}</h3>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <SalePrice
                    price={perfume.price}
                    originalPrice={perfume.originalPrice}
                    className="text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      addToCart(perfume)
                    }}
                    className="inline-flex h-10 w-12 shrink-0 items-center justify-center rounded-full bg-black text-white transition-all hover:scale-105 hover:bg-black/75"
                    aria-label={t('home.addNamedToCart', { name: perfume.name })}
                  >
                    <span className="relative inline-flex">
                      <ShoppingCart className="h-4 w-4" />
                      <Plus className="absolute left-1.5 top-0.5 h-2.5 w-2.5" />
                    </span>
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <Link
          to="/shop"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-semibold tracking-wide text-white shadow-sm transition-all active:scale-[0.98] sm:hidden"
        >
          {t('home.viewAllPerfumes')}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
        </Link>
      </div>

      <Modal isOpen={activePerfume !== null} onClose={closePerfume} title={activePerfume?.name} size="xl">
        {activePerfume ? (
          <PerfumeDetails
            perfume={activePerfume}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            onAddToCart={() => addToCart(activePerfume, selectedSize)}
          />
        ) : null}
      </Modal>
    </section>
  )
}
