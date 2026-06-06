import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  DEFAULT_PERFUME_SIZE,
  findPerfumeBySlug,
  toPerfumes,
} from "../components/home/catalogData";
import PerfumeDetails from "../components/product/PerfumeDetails";
import { useCart } from "../hooks/useCart";
import { useProductsQuery } from "../hooks/useProductsQuery";
import type { PerfumeSize } from "../types/product";
import { useI18n } from "../hooks/useI18n";

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
      <PerfumeDetails
        perfume={perfume}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        onAddToCart={() => addToCart(perfume, selectedSize)}
        variant="page"
        secondaryAction={
          <Link
            to="/shop"
            className="block w-full border border-black py-4 text-center text-sm font-medium tracking-wide transition-all hover:bg-black hover:text-white md:text-base"
          >
            {t('common.continueShopping')}
          </Link>
        }
      />
    </main>
  );
}

export default PerfumeDetailsPage;
