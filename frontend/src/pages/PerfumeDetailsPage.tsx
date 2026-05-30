import { Link, useParams } from "react-router-dom";
import { findPerfumeBySlug, toPerfumes } from "../components/home/catalogData";
import { useCart } from "../context/cart-context";
import { useProductsQuery } from "../hooks/useProductsQuery";

function PerfumeDetailsPage() {
  const { slug = "" } = useParams();
  const { addToCart } = useCart();
  const { data: products = [], isLoading } = useProductsQuery();
  const perfumes = toPerfumes(products);
  const perfume = findPerfumeBySlug(perfumes, slug);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="opacity-70">Loading perfume...</p>
      </main>
    );
  }

  if (!perfume) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-3xl tracking-wide">Perfume Not Found</h1>
        <p className="mb-6 opacity-70">
          We could not find a perfume with this name.
        </p>
        <Link
          to="/"
          className="border border-black px-6 py-3 transition-all hover:bg-black hover:text-white"
        >
          Back to Home
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
            <p className="mb-6 text-2xl tracking-wide md:text-3xl">
              {perfume.price} JOD
            </p>
            <p className="text-base leading-relaxed text-black/70 md:text-lg">
              {perfume.description}
            </p>
          </div>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => addToCart(perfume)}
              className="w-full bg-black py-4 text-sm font-medium tracking-wide text-white transition-colors hover:bg-black/80 md:text-base"
            >
              Add to Cart
            </button>
            <Link
              to="/shop"
              className="block w-full border border-black py-4 text-center text-sm font-medium tracking-wide transition-all hover:bg-black hover:text-white md:text-base"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default PerfumeDetailsPage;
