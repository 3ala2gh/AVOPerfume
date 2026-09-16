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
      <main className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-light uppercase tracking-luxe text-ink-muted">
          {t('details.loading')}
        </p>
      </main>
    );
  }

  if (!perfume) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 font-display text-4xl font-light tracking-wide">
          {t('details.notFoundTitle')}
        </h1>
        <p className="mb-8 text-sm font-light text-ink-muted">
          {t('details.notFoundText')}
        </p>
        <Link
          to="/"
          className="inline-block border border-ink/20 px-8 py-3.5 text-[11px] font-medium uppercase tracking-luxe text-ink no-underline transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white"
        >
          {t('common.backHome')}
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-ivory">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="border border-ink/10 bg-white">
          <PerfumeDetails
            perfume={perfume}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            onAddToCart={() => addToCart(perfume, selectedSize)}
            variant="page"
            secondaryAction={
              <Link
                to="/shop"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="block w-full border border-ink/20 py-4 text-center text-[11px] font-medium uppercase tracking-luxe text-ink no-underline transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white"
              >
                {t('common.continueShopping')}
              </Link>
            }
          />
        </div>
      </div>
    </main>
  );
}

export default PerfumeDetailsPage;
