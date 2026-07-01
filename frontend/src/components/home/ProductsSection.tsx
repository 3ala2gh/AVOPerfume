import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, ShoppingCart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import Modal from "../common/Modal";
import PerfumeDetails from "../product/PerfumeDetails";
import SalePrice from "../product/SalePrice";
import { useCart } from "../../hooks/useCart";
import { usePerfumeModal } from "../../hooks/usePerfumeModal";
import {
  filterPerfumes,
  type CategoryName,
  type Perfume,
} from "./catalogData";
import { useI18n } from "../../hooks/useI18n";
import {
  getCloudinarySrcSet,
  getOptimizedCloudinaryUrl,
} from "../../utils/cloudinary";

const MOBILE_VISIBLE_COUNT = 2;
const DESKTOP_VISIBLE_COUNT = 3;

type ProductsSectionProps = {
  perfumes: Perfume[];
  selectedCategory: CategoryName;
};

export default function ProductsSection({
  perfumes,
  selectedCategory,
}: ProductsSectionProps) {
  const { addToCart } = useCart();
  const { t } = useI18n();
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(() =>
    window.matchMedia("(min-width: 640px)").matches
      ? DESKTOP_VISIBLE_COUNT
      : MOBILE_VISIBLE_COUNT,
  );
  const [direction, setDirection] = useState<1 | -1>(1);
  const {
    activePerfume,
    selectedSize,
    setSelectedSize,
    openPerfume,
    closePerfume,
  } = usePerfumeModal();

  const filteredPerfumes = useMemo(
    () => filterPerfumes(perfumes, selectedCategory),
    [perfumes, selectedCategory],
  );

  const maxStartIndex = Math.max(0, filteredPerfumes.length - visibleCount);
  const safeStartIndex = Math.min(startIndex, maxStartIndex);

  const visiblePerfumes = useMemo(() => {
    if (filteredPerfumes.length === 0) {
      return [];
    }

    return filteredPerfumes.slice(safeStartIndex, safeStartIndex + visibleCount);
  }, [filteredPerfumes, safeStartIndex, visibleCount]);

  const canGoPrevious = safeStartIndex > 0;
  const canGoNext = safeStartIndex < maxStartIndex;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 640px)");

    function updateVisibleCount() {
      setVisibleCount(mediaQuery.matches ? DESKTOP_VISIBLE_COUNT : MOBILE_VISIBLE_COUNT);
    }

    mediaQuery.addEventListener("change", updateVisibleCount);

    return () => mediaQuery.removeEventListener("change", updateVisibleCount);
  }, []);

  function showNext() {
    if (!canGoNext) {
      return;
    }

    setDirection(1);
    setStartIndex((current) =>
      Math.min(maxStartIndex, Math.min(current, maxStartIndex) + visibleCount),
    );
  }

  function showPrevious() {
    if (!canGoPrevious) {
      return;
    }

    setDirection(-1);
    setStartIndex((current) =>
      Math.max(0, Math.min(current, maxStartIndex) - visibleCount),
    );
  }

  return (
    <section className="featured-products mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div id="products" className="featured-products__heading mb-8 scroll-mt-20 sm:mb-10">
        <div className="min-w-0 text-center">
          <h3 className="mb-2 text-2xl tracking-wider sm:text-4xl">
            {t('home.featuredCollection')}
          </h3>
          <p className="text-sm opacity-70 sm:text-lg">
            {t('home.perfumesAvailable', { count: filteredPerfumes.length })}
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <button
          type="button"
          onClick={showPrevious}
          disabled={!canGoPrevious}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 border border-black bg-white p-1.5 transition-all hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:p-2"
          aria-label={t('home.previousPerfumes')}
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <button
          type="button"
          onClick={showNext}
          disabled={!canGoNext}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 border border-black bg-white p-1.5 transition-all hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:p-2"
          aria-label={t('home.nextPerfumes')}
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${selectedCategory}-${safeStartIndex}`}
            custom={direction}
            variants={{
              enter: (slideDirection: 1 | -1) => ({
                x: slideDirection > 0 ? 56 : -56,
                opacity: 0,
              }),
              center: { x: 0, opacity: 1 },
              exit: (slideDirection: 1 | -1) => ({
                x: slideDirection > 0 ? -56 : 56,
                opacity: 0,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid grid-cols-2 gap-4 px-9 sm:grid-cols-3 sm:gap-3 sm:px-12 md:gap-5"
          >
            {visiblePerfumes.map((perfume, cardIndex) => (
              <div
                key={`${perfume.name}-${cardIndex}`}
                className="group flex h-full flex-col w-full cursor-pointer"
                onClick={() => openPerfume(perfume)}
              >
                <div className="featured-products__image relative mb-2 aspect-[9/16] overflow-hidden sm:aspect-auto sm:h-[clamp(18rem,44vh,27.5rem)]">
                  {perfume.discountPercent ? <span className="absolute bottom-2 left-2 z-10 rounded-full bg-black px-3 py-1 text-xs text-white sm:bottom-auto sm:top-2">{t('common.sale')}</span> : null}
                  <img
                    src={getOptimizedCloudinaryUrl(perfume.image, { width: 600 })}
                    srcSet={getCloudinarySrcSet(perfume.image, [300, 450, 600])}
                    sizes="(min-width: 640px) 30vw, 42vw"
                    alt={perfume.name}
                    className="h-full w-full object-cover transition-transform duration-500 sm:object-contain"
                    loading="lazy"
                    decoding="async"
                  />

                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                </div>

                <h4 className="mb-1 line-clamp-2 text-[11px] tracking-wide sm:mb-2 sm:text-base md:text-xl">
                  {perfume.name}
                </h4>
                <p className="featured-products__description mb-2 hidden min-h-[40px] text-sm opacity-60 md:block">
                  {perfume.description}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <SalePrice price={perfume.price} originalPrice={perfume.originalPrice} className="text-[11px] sm:text-sm md:text-lg" />
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      addToCart(perfume);
                    }}
                    className="inline-flex h-8 w-10 items-center justify-center rounded-full border border-black bg-white transition-all duration-300 hover:bg-black hover:text-white sm:h-10 sm:w-14"
                    aria-label={t('home.addNamedToCart', { name: perfume.name })}
                  >
                    <span className="relative inline-flex">
                      <ShoppingCart className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                      <Plus className="absolute left-1.5 top-0.5 h-2 w-2 sm:left-2 sm:top-1 sm:h-3 sm:w-3" />
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex flex-row flex-wrap items-center justify-center gap-3 sm:mt-8">
        <Link
          to="/shop"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="border border-black px-6 py-2.5 text-sm font-medium tracking-wide transition-all hover:bg-black hover:text-white sm:text-base"
        >
          {t('home.viewAllPerfumes')}
        </Link>
        <Link
          to="/offers"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="border border-black px-6 py-2.5 text-sm font-medium tracking-wide transition-all hover:bg-black hover:text-white sm:text-base"
        >
          {t('home.viewOffers')}
        </Link>
      </div>

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
          />
        ) : null}
      </Modal>
    </section>
  );
}
