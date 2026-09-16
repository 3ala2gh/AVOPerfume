import { Filter, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Modal from "../components/common/Modal";
import Select from "../components/common/ui/Select";
import { getCategoryOrder, toPerfumes } from "../components/home/catalogData";
import PerfumeDetails from "../components/product/PerfumeDetails";
import SalePrice from "../components/product/SalePrice";
import SaleBadge from "../components/product/SaleBadge";
import { useCart } from "../hooks/useCart";
import { usePerfumeModal } from "../hooks/usePerfumeModal";
import { useProductsQuery } from "../hooks/useProductsQuery";
import {
  useShopFilters,
  type ShopGenderFilter,
  type ShopSortOption,
} from "../hooks/useShopFilters";
import { useI18n } from "../hooks/useI18n";
import {
  getCloudinarySrcSet,
  getOptimizedCloudinaryUrl,
} from "../utils/cloudinary";

const selectClasses =
  "w-full rounded-none border-0 border-b border-ink/15 bg-transparent px-0 py-2.5 text-sm font-light tracking-wide outline-none transition-colors focus:border-champagne";

function ShopPage() {
  const { data: products = [] } = useProductsQuery();
  const perfumes = useMemo(() => toPerfumes(products), [products]);
  const categories = getCategoryOrder(perfumes);
  const { addToCart } = useCart();
  const { t, categoryLabel } = useI18n();

  const [showFiltersOnMobile, setShowFiltersOnMobile] = useState(false);
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
  } = useShopFilters(perfumes);
  const {
    activePerfume,
    selectedSize,
    setSelectedSize,
    openPerfume,
    closePerfume,
  } = usePerfumeModal();

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <section className="relative overflow-hidden bg-ink py-20 text-white sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(184,146,90,0.18),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="eyebrow mb-4">{t("home.featuredCollection")}</p>
          <h1 className="font-display text-4xl font-light tracking-wide sm:text-6xl">
            {t("shop.title")}
          </h1>
          <div className="mx-auto my-6 h-px w-20 bg-gradient-to-r from-transparent via-champagne to-transparent" />
          <p className="mx-auto max-w-lg text-sm font-light leading-relaxed text-white/60 sm:text-base">
            {t("shop.subtitle")}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
          <aside className="lg:w-60 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-28">
              <div className="mb-6 flex items-center justify-between border-b border-ink/10 pb-4">
                <h2 className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-luxe">
                  <Filter className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {t("common.filters")}
                </h2>
                <button
                  type="button"
                  className="text-[11px] uppercase tracking-widest text-ink-muted transition-colors hover:text-champagne lg:hidden"
                  onClick={() => setShowFiltersOnMobile((value) => !value)}
                >
                  {showFiltersOnMobile ? t("common.hide") : t("common.show")}
                </button>
              </div>

              <div
                className={`space-y-7 ${showFiltersOnMobile ? "block" : "hidden"} lg:block`}
              >
                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-widest text-ink-muted">
                    {t("shop.search")}
                  </label>
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute start-0 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30"
                      strokeWidth={1.5}
                    />
                    <input
                      type="text"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder={t("shop.searchPlaceholder")}
                      className="w-full border-0 border-b border-ink/15 bg-transparent py-2.5 ps-6 text-sm font-light tracking-wide outline-none transition-colors placeholder:text-ink/30 focus:border-champagne"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-widest text-ink-muted">
                    {t("common.category")}
                  </label>
                  <Select
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    className={selectClasses}
                    aria-label={t("shop.chooseCategory")}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {categoryLabel(
                          category,
                          perfumes.find(
                            (perfume) => perfume.category === category,
                          )?.categoryAr,
                        )}{" "}
                        (
                        {category === "All"
                          ? perfumes.length
                          : perfumes.filter(
                              (perfume) => perfume.category === category,
                            ).length}
                        )
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-widest text-ink-muted">
                    {t("common.gender")}
                  </label>
                  <Select
                    value={gender}
                    onChange={(event) =>
                      setGender(event.target.value as ShopGenderFilter)
                    }
                    className={selectClasses}
                  >
                    <option value="all">{categoryLabel("All")}</option>
                    <option value="male">{t("common.male")}</option>
                    <option value="female">{t("common.female")}</option>
                    <option value="unisex">{t("common.unisex")}</option>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-widest text-ink-muted">
                    {t("shop.sortBy")}
                  </label>
                  <Select
                    value={sort}
                    onChange={(event) =>
                      setSort(event.target.value as ShopSortOption)
                    }
                    className={selectClasses}
                  >
                    <option value="name">{t("shop.sortName")}</option>
                    <option value="price-low">{t("shop.sortPriceLow")}</option>
                    <option value="price-high">
                      {t("shop.sortPriceHigh")}
                    </option>
                  </Select>
                </div>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-full border border-ink/20 px-4 py-3 text-[10px] font-medium uppercase tracking-luxe text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white"
                >
                  {t("shop.resetFilters")}
                </button>
              </div>
            </div>
          </aside>

          <section className="flex-1">
            <div className="mb-8 flex items-center justify-between border-b border-ink/10 pb-4">
              <p className="text-[11px] uppercase tracking-widest text-ink-muted">
                {t("shop.showingPerfumes", { count: filteredPerfumes.length })}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
              {filteredPerfumes.map((perfume, index) => (
                <motion.div
                  key={perfume.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.6,
                    delay: Math.min(index * 0.04, 0.3),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group cursor-pointer text-start"
                  onClick={() => openPerfume(perfume)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openPerfume(perfume);
                    }
                  }}
                >
                  <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-sand">
                    {perfume.isBestSeller ? (
                      <span className="absolute left-0 top-4 z-10 bg-ink px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest text-white">
                        {t("home.bestSellerBadge")}
                      </span>
                    ) : null}
                    <SaleBadge
                      discountPercent={perfume.discountPercent}
                      className="absolute bottom-4 left-4 z-10"
                    />
                    <img
                      src={getOptimizedCloudinaryUrl(perfume.image, {
                        width: 600,
                      })}
                      srcSet={getCloudinarySrcSet(perfume.image, [300, 450, 600])}
                      sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 46vw"
                      alt={perfume.name}
                      className="h-full w-full object-contain p-4 transition-transform duration-[900ms] ease-luxe group-hover:scale-[1.06] sm:p-6"
                      loading="lazy"
                      decoding="async"
                    />

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        addToCart(perfume);
                      }}
                      className="absolute inset-x-0 bottom-0 z-10 hidden translate-y-full items-center justify-center gap-2 bg-ink/95 py-3 text-[10px] font-medium uppercase tracking-luxe text-white backdrop-blur-sm transition-transform duration-500 ease-luxe group-hover:translate-y-0 hover:bg-champagne lg:flex"
                      aria-label={t("home.addNamedToCart", {
                        name: perfume.name,
                      })}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      {t("common.addToCart")}
                    </button>
                  </div>

                  <p className="text-[10px] uppercase tracking-widest text-ink-muted">
                    {categoryLabel(perfume.category, perfume.categoryAr)}
                  </p>
                  <h3 className="mt-1.5 line-clamp-1 font-display text-lg font-normal tracking-wide transition-colors duration-300 group-hover:text-champagne sm:text-xl">
                    {perfume.name}
                  </h3>
                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <SalePrice
                      price={perfume.price}
                      originalPrice={perfume.originalPrice}
                      className="text-sm"
                    />
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        addToCart(perfume);
                      }}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition-all duration-300 hover:border-champagne hover:bg-champagne hover:text-white lg:hidden"
                      aria-label={t("home.addNamedToCart", {
                        name: perfume.name,
                      })}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredPerfumes.length === 0 && (
              <div className="border border-ink/10 bg-white px-4 py-16 text-center">
                <p className="font-display text-xl font-light text-ink-muted">
                  {t("common.noPerfumes")}
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 border border-ink/20 px-6 py-3 text-[10px] font-medium uppercase tracking-luxe transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white"
                >
                  {t("shop.resetFilters")}
                </button>
              </div>
            )}
          </section>
        </div>
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
            showGender
          />
        ) : null}
      </Modal>
    </div>
  );
}

export default ShopPage;
