import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, ShoppingCart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import Modal from "../common/Modal";
import { useCart } from "../../context/cart-context";
import { type CategoryName, type Perfume } from "./catalogData";

const VISIBLE_COUNT = 3;

type ProductsSectionProps = {
  perfumes: Perfume[];
  selectedCategory: CategoryName;
};

export default function ProductsSection({
  perfumes,
  selectedCategory,
}: ProductsSectionProps) {
  const { addToCart } = useCart();
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [activePerfume, setActivePerfume] = useState<Perfume | null>(null);

  const filteredPerfumes = useMemo(
    () =>
      selectedCategory === "All"
        ? perfumes
        : perfumes.filter((perfume) => perfume.category === selectedCategory),
    [perfumes, selectedCategory],
  );

  const visiblePerfumes = useMemo(() => {
    if (filteredPerfumes.length === 0) {
      return [];
    }

    return filteredPerfumes.slice(startIndex, startIndex + VISIBLE_COUNT);
  }, [filteredPerfumes, startIndex]);

  const maxStartIndex = Math.max(0, filteredPerfumes.length - VISIBLE_COUNT);
  const canGoPrevious = startIndex > 0;
  const canGoNext = startIndex < maxStartIndex;

  useEffect(() => {
    setStartIndex(0);
  }, [selectedCategory, perfumes]);

  function showNext() {
    if (!canGoNext) {
      return;
    }

    setDirection(1);
    setStartIndex((current) =>
      Math.min(maxStartIndex, current + VISIBLE_COUNT),
    );
  }

  function showPrevious() {
    if (!canGoPrevious) {
      return;
    }

    setDirection(-1);
    setStartIndex((current) => Math.max(0, current - VISIBLE_COUNT));
  }

  return (
    <section
      id="products"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mb-8 sm:mb-10 ">
        <div className="min-w-0 text-center">
          <h3 className="mb-2 text-2xl tracking-wider sm:text-4xl">
            FEATURED COLLECTION
          </h3>
          <p className="text-sm opacity-70 sm:text-lg">
            {filteredPerfumes.length} perfumes available
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <button
          type="button"
          onClick={showPrevious}
          disabled={!canGoPrevious}
          className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 border border-black bg-white p-2 transition-all hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:block"
          aria-label="Show previous perfumes"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={showNext}
          disabled={!canGoNext}
          className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 border border-black bg-white p-2 transition-all hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:block"
          aria-label="Show next perfumes"
        >
          <ChevronRight className="h-5 w-5" />
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
            className="grid grid-cols-3 gap-2 px-0 sm:gap-3 sm:px-12 md:gap-5"
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
                    {perfume.price} JOD
                  </span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      addToCart(perfume);
                    }}
                    className="inline-flex h-9 w-12 items-center justify-center rounded-full border border-black bg-white transition-all duration-300 hover:bg-black hover:text-white sm:h-10 sm:w-14"
                    aria-label={`Add ${perfume.name} to cart`}
                  >
                    <span className="relative inline-flex">
                      <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                      <Plus className="absolute left-1.5 top-0.5 h-2.5 w-2.5 sm:left-2 sm:top-1 sm:h-3 sm:w-3" />
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 sm:hidden">
        <button
          type="button"
          onClick={showPrevious}
          disabled={!canGoPrevious}
          className="border border-black bg-white p-1.5 transition-all hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Show previous perfumes"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={showNext}
          disabled={!canGoNext}
          className="border border-black bg-white p-1.5 transition-all hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Show next perfumes"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row">
        <Link
          to="/shop"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="border border-black px-6 py-2.5 text-sm font-medium tracking-wide transition-all hover:bg-black hover:text-white sm:text-base"
        >
          View All Perfumes
        </Link>
        <Link
          to="/offers"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="border border-black px-6 py-2.5 text-sm font-medium tracking-wide transition-all hover:bg-black hover:text-white sm:text-base"
        >
          View Offers
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
            <div className="relative min-h-[320px] bg-gray-100 p-3 md:min-h-[420px]">
              <img
                src={activePerfume.image}
                alt={activePerfume.name}
                className="h-full w-full object-contain"
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
                <p className="mb-6 text-2xl tracking-wide md:text-3xl">
                  {activePerfume.price} JOD
                </p>
                <p className="text-base leading-relaxed text-black/70 md:text-lg">
                  {activePerfume.description}
                </p>
              </div>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => addToCart(activePerfume)}
                  className="w-full bg-black py-4 text-sm font-medium tracking-wide text-white transition-colors hover:bg-black/80 md:text-base"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  );
}
