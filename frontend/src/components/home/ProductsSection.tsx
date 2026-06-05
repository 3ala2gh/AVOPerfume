import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, ShoppingCart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import Modal from "../common/Modal";
import { useCart } from "../../context/cart-context";
import {
  DEFAULT_PERFUME_SIZE,
  filterPerfumes,
  getPerfumeSizePrice,
  PERFUME_SIZE_OPTIONS,
  type CategoryName,
  type Perfume,
} from "./catalogData";
import type { PerfumeSize } from "../../types/product";
import { useI18n } from "../../i18n";

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
  const [visibleCount, setVisibleCount] = useState(MOBILE_VISIBLE_COUNT);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [activePerfume, setActivePerfume] = useState<Perfume | null>(null);
  const [selectedSize, setSelectedSize] = useState<PerfumeSize>(DEFAULT_PERFUME_SIZE);

  const filteredPerfumes = useMemo(
    () => filterPerfumes(perfumes, selectedCategory),
    [perfumes, selectedCategory],
  );

  const visiblePerfumes = useMemo(() => {
    if (filteredPerfumes.length === 0) {
      return [];
    }

    return filteredPerfumes.slice(startIndex, startIndex + visibleCount);
  }, [filteredPerfumes, startIndex, visibleCount]);

  const maxStartIndex = Math.max(0, filteredPerfumes.length - visibleCount);
  const canGoPrevious = startIndex > 0;
  const canGoNext = startIndex < maxStartIndex;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 640px)");

    function updateVisibleCount() {
      setVisibleCount(mediaQuery.matches ? DESKTOP_VISIBLE_COUNT : MOBILE_VISIBLE_COUNT);
    }

    updateVisibleCount();
    mediaQuery.addEventListener("change", updateVisibleCount);

    return () => mediaQuery.removeEventListener("change", updateVisibleCount);
  }, []);

  useEffect(() => {
    setStartIndex(0);
  }, [selectedCategory, perfumes, visibleCount]);

  useEffect(() => {
    setSelectedSize(DEFAULT_PERFUME_SIZE);
  }, [activePerfume]);

  function showNext() {
    if (!canGoNext) {
      return;
    }

    setDirection(1);
    setStartIndex((current) =>
      Math.min(maxStartIndex, current + visibleCount),
    );
  }

  function showPrevious() {
    if (!canGoPrevious) {
      return;
    }

    setDirection(-1);
    setStartIndex((current) => Math.max(0, current - visibleCount));
  }

  return (
    <section
      id="products"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mb-8 sm:mb-10 ">
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
            key={`${selectedCategory}-${startIndex}`}
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
                onClick={() => setActivePerfume(perfume)}
              >
                <div className="relative mb-2 aspect-[3/4] overflow-hidden bg-gray-100 p-2">
                  <img
                    src={perfume.image}
                    alt={perfume.name}
                    className="h-full w-full object-contain transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                </div>

                <h4 className="mb-1 line-clamp-2 text-[11px] tracking-wide sm:mb-2 sm:text-base md:text-xl">
                  {perfume.name}
                </h4>
                <p className="mb-2 hidden min-h-[40px] text-sm opacity-60 md:block">
                  {perfume.description}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-[11px] sm:text-sm md:text-lg">
                    {perfume.price} {t('common.jod')}
                  </span>
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
        onClose={() => setActivePerfume(null)}
        title={activePerfume?.name}
        size="lg"
      >
        {activePerfume ? (
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative flex min-h-[170px] items-center justify-center bg-gray-100 p-1 sm:min-h-[210px] md:min-h-[420px]">
              <img
                src={activePerfume.image}
                alt={activePerfume.name}
                className="max-h-[160px] w-full object-contain sm:max-h-[200px] md:max-h-[390px]"
              />
            </div>
            <div className="p-6 md:p-10">
              <div className="mb-6">
                <p className="mb-2 text-xs tracking-[0.18em] uppercase text-black/50">
                  {activePerfume.category}
                </p>
                <h2 className="mb-4 text-3xl tracking-wide md:text-4xl">
                  {activePerfume.name}
                </h2>
                <p className="mb-4 text-2xl tracking-wide md:text-3xl">
                  {getPerfumeSizePrice(activePerfume, selectedSize)} {t('common.jod')}
                </p>
                <div className="mb-6 grid grid-cols-3 gap-2">
                  {PERFUME_SIZE_OPTIONS.map((size) => {
                    const isActive = selectedSize === size;

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`border px-2 py-2 text-center transition-colors ${
                          isActive
                            ? "border-black bg-black text-white"
                            : "border-black/20 hover:border-black"
                        }`}
                      >
                        <span className="block text-xs tracking-wide">{size}</span>
                        <span className="block text-sm font-medium">
                          {getPerfumeSizePrice(activePerfume, size)} {t('common.jod')}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-base leading-relaxed text-black/70 md:text-lg">
                  {activePerfume.description}
                </p>
              </div>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => addToCart(activePerfume, selectedSize)}
                  className="w-full bg-black py-4 text-sm font-medium tracking-wide text-white transition-colors hover:bg-black/80 md:text-base"
                >
                  {t('common.addToCart')}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  );
}
