import { useMemo, useState } from "react";
import Input from "../common/ui/Input";
import type { Product } from "../../types/product";

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
    <section className="space-y-3 rounded-xl border border-black/10 bg-white/90 p-4 sm:p-5 lg:p-6">
      <h2 className="text-base font-semibold sm:text-lg">
        Search and Edit Perfumes
      </h2>
      <Input
        type="text"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search by name, category, description, or price"
      />
      {isLoadingProducts && (
        <p className="text-sm text-black/70">Loading perfumes...</p>
      )}
      {!isLoadingProducts && filteredProducts.length === 0 && (
        <p className="text-sm text-black/70">No perfumes match your search.</p>
      )}
      <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
        {filteredProducts.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => onSelectPerfume(product)}
            className="flex w-full items-center gap-3 rounded-md border border-black/20 px-2.5 py-2 text-left transition-colors hover:bg-black/5 sm:px-3"
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={`${product.name} thumbnail`}
                className="h-12 w-12 shrink-0 rounded-md border border-black/10 object-cover"
              />
            ) : (
              <div className="h-12 w-12 shrink-0 rounded-md border border-dashed border-black/20 bg-black/[0.03]" />
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium sm:text-base">
                {product.name}
              </p>
              <p className="text-xs text-black/70 sm:text-sm">
                {product.category} - {product.price.toFixed(2)} JOD
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
