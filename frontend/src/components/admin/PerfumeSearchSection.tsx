import { useMemo, useState } from "react";
import Input from "../common/ui/Input";
import type { Product } from "../../types/product";
import { useI18n } from "../../hooks/useI18n";
import { getOptimizedCloudinaryUrl } from "../../utils/cloudinary";
import AdminCollapsibleSection from "./AdminCollapsibleSection";

type PerfumeSearchSectionProps = {
  products: Product[];
  isLoadingProducts: boolean;
  onSelectPerfume: (product: Product) => void;
};

export default function PerfumeSearchSection({
  products,
  isLoadingProducts,
  onSelectPerfume,
}: PerfumeSearchSectionProps) {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) => {
      const haystack = [
        product.name,
        product.category,
        product.description ?? "",
        String(product.price),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [products, searchTerm]);

  return (
    <AdminCollapsibleSection
      title={t('admin.searchEditPerfumes')}
      description="Find any perfume quickly and open it in the edit modal."
      defaultOpen
    >
      <div className="space-y-3">
        <Input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder={t('admin.searchPerfumesPlaceholder')}
        />
        {isLoadingProducts && (
          <p className="text-sm text-black/70">{t('admin.loadingPerfumes')}</p>
        )}
        {!isLoadingProducts && filteredProducts.length === 0 && (
          <p className="text-sm text-black/70">{t('admin.noPerfumesSearch')}</p>
        )}
        <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelectPerfume(product)}
              className="flex w-full items-center gap-3 rounded-md border border-black/20 bg-white/85 px-2.5 py-2 text-left transition-colors hover:bg-black/5 sm:px-3"
            >
              {product.imageUrl ? (
                <img
                  src={getOptimizedCloudinaryUrl(product.imageUrl, { width: 160 })}
                  alt={product.name}
                  className="h-12 w-12 shrink-0 rounded-md border border-black/10 object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="h-12 w-12 shrink-0 rounded-md border border-dashed border-black/20 bg-black/[0.03]" />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium sm:text-base">
                  {product.name}
                </p>
                <p className="text-xs text-black/70 sm:text-sm">
                  {product.category} - {product.price.toFixed(2)} {t('common.jod')}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </AdminCollapsibleSection>
  );
}
