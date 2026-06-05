import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  DEFAULT_PERFUME_SIZE,
  findPerfumeBySlug,
  getPerfumeSizePrice,
  PERFUME_SIZE_OPTIONS,
  toPerfumes,
} from "../components/home/catalogData";
import { useCart } from "../context/cart-context";
import { useProductsQuery } from "../hooks/useProductsQuery";
import type { PerfumeSize } from "../types/product";
import { useI18n } from "../i18n";

function PerfumeDetailsPage() {
  const { slug = "" } = useParams();
  const { addToCart } = useCart();
  const { t } = useI18n();
  const [selectedSize, setSelectedSize] = useState<PerfumeSize>(DEFAULT_PERFUME_SIZE);
  const { data: products = [], isLoading } = useProductsQuery();
  const perfumes = toPerfumes(products);
  const perfume = findPerfumeBySlug(perfumes, slug);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="opacity-70">{t('details.loading')}</p>
      </main>
    );
  }

  if (!perfume) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-3xl tracking-wide">{t('details.notFoundTitle')}</h1>
        <p className="mb-6 opacity-70">
          {t('details.notFoundText')}
        </p>
        <Link
          to="/"
          className="border border-black px-6 py-3 transition-all hover:bg-black hover:text-white"
        >
          {t('common.backHome')}
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative aspect-square">
          <img
            src={perfume.image}
            alt={perfume.name}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="p-6 md:p-10">
          <div className="mb-6">
            <p className="mb-2 text-xs tracking-[0.18em] uppercase text-black/50">
              {perfume.category}
            </p>
            <h1 className="mb-4 text-3xl tracking-wide md:text-4xl">
              {perfume.name}
            </h1>
            <p className="mb-4 text-2xl tracking-wide md:text-3xl">
              {getPerfumeSizePrice(perfume, selectedSize)} {t('common.jod')}
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
                      {getPerfumeSizePrice(perfume, size)} {t('common.jod')}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-base leading-relaxed text-black/70 md:text-lg">
              {perfume.description}
            </p>
          </div>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => addToCart(perfume, selectedSize)}
              className="w-full bg-black py-4 text-sm font-medium tracking-wide text-white transition-colors hover:bg-black/80 md:text-base"
            >
              {t('common.addToCart')}
            </button>
            <Link
              to="/shop"
              className="block w-full border border-black py-4 text-center text-sm font-medium tracking-wide transition-all hover:bg-black hover:text-white md:text-base"
            >
              {t('common.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default PerfumeDetailsPage;
