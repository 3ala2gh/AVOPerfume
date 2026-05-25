import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { perfumes, type CategoryName } from "./catalogData";

const VISIBLE_COUNT = 3;

type ProductsSectionProps = {
  selectedCategory: CategoryName;
};

export default function ProductsSection({
  selectedCategory,
}: ProductsSectionProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const filteredPerfumes = useMemo(
    () =>
      selectedCategory === "All"
        ? perfumes
        : perfumes.filter((perfume) => perfume.category === selectedCategory),
    [selectedCategory],
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

  function showNext() {
    if (!canGoNext) {
      return;
    }

    setDirection(1);
    setStartIndex((current) => Math.min(maxStartIndex, current + VISIBLE_COUNT));
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
      <div className="mb-8 sm:mb-10">
        <div className="min-w-0">
          <h3 className="mb-2 text-2xl tracking-wider sm:text-4xl">FEATURED COLLECTION</h3>
          <p className="text-sm opacity-70 sm:text-lg">{filteredPerfumes.length} perfumes available</p>
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
                className="group w-full cursor-pointer"
              >
                <div className="relative mb-2 aspect-[3/4] overflow-hidden bg-gray-100">
                  <img
                    src={perfume.image}
                    alt={perfume.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                </div>

                <h4 className="mb-1 line-clamp-2 text-[11px] tracking-wide sm:mb-2 sm:text-base md:text-xl">
                  {perfume.name}
                </h4>
                <p className="mb-2 hidden text-sm opacity-60 md:block">{perfume.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-sm md:text-lg">${perfume.price}</span>
                  <button
                    type="button"
                    className="border border-black px-2 py-1 text-[10px] transition-all duration-300 hover:bg-black hover:text-white sm:px-3 sm:py-1 sm:text-xs md:px-6 md:py-2 md:text-sm"
                  >
                    <span className="sm:hidden">Add to Cart</span>
                    <span className="hidden sm:inline">Add to Cart</span>
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
    </section>
  );
}
