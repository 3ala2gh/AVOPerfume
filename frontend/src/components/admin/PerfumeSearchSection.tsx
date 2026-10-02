import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, CirclePlus, Pencil, Search, SprayCan, X } from "lucide-react";
import Input from "../common/ui/Input";
import type { Product } from "../../types/product";
import { useI18n } from "../../hooks/useI18n";
import { getOptimizedCloudinaryUrl } from "../../utils/cloudinary";
import AdminEmptyState, { AdminListSkeleton } from "./AdminEmptyState";
import AdminPanel from "./AdminPanel";
import { adminButtonClass } from "./adminStyles";

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
  const { t, genderLabel } = useI18n();
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

  const addPerfumeLink = (
    <Link to="/admin/perfumes/new" className={adminButtonClass("primary", "md")}>
      <CirclePlus className="h-4 w-4" />
      {t("admin.nav.addPerfume")}
    </Link>
  );

  if (!isLoadingProducts && products.length === 0) {
    return (
      <AdminEmptyState
        icon={SprayCan}
        title={t("admin.noPerfumesYet")}
        description={t("admin.addFirstPerfume")}
        action={addPerfumeLink}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <Input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t("admin.searchPerfumesPlaceholder")}
            aria-label={t("admin.searchPerfumesPlaceholder")}
            className="pe-10 ps-10"
          />
          {searchTerm ? (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              aria-label={t("common.cancel")}
              className="absolute end-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-ink/50 hover:bg-sand hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        {addPerfumeLink}
      </div>

      <AdminPanel flush className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink/[0.06] px-4 py-3 text-xs font-medium text-ink-muted sm:px-5">
          <span>{t("admin.perfumeCount", { count: filteredProducts.length })}</span>
        </div>

        {/* Column headings — tablet and up */}
        <div className="hidden grid-cols-[minmax(0,2.4fr)_minmax(0,1.2fr)_minmax(0,1.6fr)_auto] gap-4 border-b border-ink/[0.06] bg-ivory/60 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/45 md:grid">
          <span>{t("common.name")}</span>
          <span>{t("common.category")}</span>
          <span>{t("admin.sizePrices")}</span>
          <span className="w-20" />
        </div>

        {isLoadingProducts ? (
          <div className="p-4 sm:p-5">
            <AdminListSkeleton rows={5} />
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-muted">{t("admin.noPerfumesSearch")}</p>
        ) : (
          <ul className="divide-y divide-ink/[0.06]">
            {filteredProducts.map((product) => {
              const enabledSizes = product.sizes.filter((size) => size.enabled !== false);

              return (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() => onSelectPerfume(product)}
                    className="group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 text-start transition-colors hover:bg-sand/40 sm:px-5 md:grid-cols-[minmax(0,2.4fr)_minmax(0,1.2fr)_minmax(0,1.6fr)_auto] md:gap-4"
                  >
                    {/* Name + image (+ category on phones) */}
                    <span className="contents md:flex md:min-w-0 md:items-center md:gap-3">
                      {product.imageUrl ? (
                        <img
                          src={getOptimizedCloudinaryUrl(product.imageUrl, { width: 160 })}
                          alt=""
                          className="h-12 w-12 shrink-0 rounded-lg border border-ink/10 bg-white object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <span className="h-12 w-12 shrink-0 rounded-lg border border-dashed border-ink/20 bg-ivory" />
                      )}
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold text-ink">{product.name}</span>
                          {product.discountPercent ? (
                            <span className="shrink-0 rounded-full bg-champagne/15 px-2 py-0.5 text-[11px] font-semibold text-champagne-dark">
                              -{product.discountPercent}%
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-ink-muted md:hidden">
                          {product.category} · {product.price.toFixed(2)} {t("common.jod")}
                        </span>
                        <span className="mt-0.5 hidden text-xs text-ink-muted md:block">
                          {genderLabel(product.gender)}
                        </span>
                      </span>
                    </span>

                    <span className="hidden truncate text-sm text-ink-muted md:block">{product.category}</span>

                    <span className="hidden flex-wrap gap-1.5 md:flex">
                      {enabledSizes.map((size) => (
                        <span
                          key={size.size}
                          className="rounded-md bg-sand/70 px-1.5 py-0.5 text-[11px] font-medium text-ink/70"
                        >
                          {size.size} · {size.price.toFixed(2)}
                        </span>
                      ))}
                    </span>

                    <span className="flex items-center justify-end">
                      <span className="hidden h-9 items-center gap-1.5 rounded-lg border border-ink/15 bg-white px-3 text-sm font-medium text-ink transition-colors group-hover:border-ink/30 md:inline-flex">
                        <Pencil className="h-3.5 w-3.5" />
                        {t("admin.edit")}
                      </span>
                      <ChevronRight className="h-5 w-5 text-ink/30 md:hidden rtl:rotate-180" />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </AdminPanel>
    </div>
  );
}
