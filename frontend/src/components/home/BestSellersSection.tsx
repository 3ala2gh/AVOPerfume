import { ArrowRight, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Modal from '../common/Modal'
import Reveal from '../common/Reveal'
import PerfumeDetails from '../product/PerfumeDetails'
import SaleBadge from '../product/SaleBadge'
import SalePrice from '../product/SalePrice'
import { useCart } from '../../hooks/useCart'
import { useHorizontalCarousel } from '../../hooks/useHorizontalCarousel'
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
    carouselRef,
    canScrollPrev,
    canScrollNext,
    scrollCarousel,
    carouselHandlers,
  } = useHorizontalCarousel(bestSellers.length)
  const {
    activePerfume,
    selectedSize,
    setSelectedSize,
    openPerfume,
    closePerfume,
  } = usePerfumeModal()

  if (bestSellers.length === 0) return null

  return (
    <section id="best-sellers" className="scroll-mt-24 bg-ivory py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 flex items-end justify-between gap-6 sm:mb-14">
          <div>
            <p className="eyebrow mb-3">{t('home.customerFavorites')}</p>
            <h2 className="font-display text-4xl font-light tracking-wide sm:text-5xl lg:text-6xl">
              {t('home.bestSellers')}
            </h2>
            <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-ink-muted sm:text-base">
              {t('home.bestSellersSubtitle')}
            </p>
          </div>
          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <div className="hidden items-center gap-2 lg:flex">
              <button
                type="button"
                onClick={() => scrollCarousel('previous')}
                disabled={!canScrollPrev}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-all duration-300 hover:border-champagne hover:bg-champagne hover:text-white disabled:pointer-events-none disabled:opacity-25"
                aria-label={t('home.previousPerfumes')}
              >
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('next')}
                disabled={!canScrollNext}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-all duration-300 hover:border-champagne hover:bg-champagne hover:text-white disabled:pointer-events-none disabled:opacity-25"
                aria-label={t('home.nextPerfumes')}
              >
                <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </button>
            </div>
            <Link
              to="/shop"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group inline-flex shrink-0 items-center justify-center gap-2.5 bg-ink px-7 py-3.5 text-[11px] font-medium uppercase tracking-luxe text-white transition-all duration-500 ease-luxe hover:bg-champagne"
            >
              {t('home.viewAllPerfumes')}
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </Reveal>

        <div
          ref={carouselRef}
          {...carouselHandlers}
          className="best-sellers-carousel -mx-4 flex touch-pan-x touch-pan-y snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden px-4 pb-4 sm:-mx-6 sm:gap-6 sm:px-6 lg:mx-0 lg:cursor-grab lg:px-0 lg:active:cursor-grabbing"
        >
          {bestSellers.map((perfume, index) => (
            <motion.article
              key={perfume.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: Math.min(index * 0.08, 0.32),
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => openPerfume(perfume)}
              className="group min-w-[78%] cursor-pointer snap-start sm:min-w-[42%] lg:min-w-[calc(25%-1.125rem)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                <span className="absolute left-0 top-4 z-10 bg-ink px-3 py-1.5 text-[9px] font-medium uppercase tracking-widest text-white">
                  {t('home.bestSellerBadge')}
                </span>
                <span className="absolute right-4 top-4 z-10 font-display text-sm text-ink/30">
                  {String(perfume.bestSellerRank ?? index + 1).padStart(2, '0')}
                </span>
                <SaleBadge
                  discountPercent={perfume.discountPercent}
                  className="absolute bottom-4 left-4 z-10"
                />
                <img
                  src={getOptimizedCloudinaryUrl(perfume.image, { width: 700 })}
                  srcSet={getCloudinarySrcSet(perfume.image, [400, 600, 800])}
                  sizes="(min-width: 1024px) 24vw, (min-width: 640px) 42vw, 78vw"
                  alt={perfume.name}
                  className="h-full w-full object-contain p-7 transition-transform duration-[900ms] ease-luxe group-hover:scale-[1.07] sm:p-9"
                  loading="lazy"
                  decoding="async"
                />

                {/* Quick-add slides up from the bottom edge on hover (desktop only). */}
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    addToCart(perfume)
                  }}
                  className="absolute inset-x-0 bottom-0 z-10 hidden translate-y-full items-center justify-center gap-2 bg-ink/95 py-3.5 text-[10px] font-medium uppercase tracking-luxe text-white backdrop-blur-sm transition-transform duration-500 ease-luxe group-hover:translate-y-0 hover:bg-champagne lg:flex"
                  aria-label={t('home.addNamedToCart', { name: perfume.name })}
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t('common.addToCart')}
                </button>
              </div>

              <div className="pt-5">
                <p className="text-[10px] uppercase tracking-widest text-ink-muted">
                  {categoryLabel(perfume.category, perfume.categoryAr)}
                </p>
                <h3 className="mt-2 line-clamp-1 font-display text-xl font-normal tracking-wide transition-colors duration-300 group-hover:text-champagne">
                  {perfume.name}
                </h3>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <SalePrice
                    price={perfume.price}
                    originalPrice={perfume.originalPrice}
                    className="text-sm"
                  />
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      addToCart(perfume)
                    }}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition-all duration-300 hover:border-champagne hover:bg-champagne hover:text-white lg:hidden"
                    aria-label={t('home.addNamedToCart', { name: perfume.name })}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <Link
          to="/shop"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mt-8 flex w-full items-center justify-center gap-2 bg-ink px-6 py-4 text-[11px] font-medium uppercase tracking-luxe text-white transition-colors hover:bg-champagne sm:hidden"
        >
          {t('home.viewAllPerfumes')}
          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
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
