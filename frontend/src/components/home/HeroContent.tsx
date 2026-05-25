export default function HeroContent() {
  const heroImage =
    "https://images.unsplash.com/photo-1610245182596-a7ad35b1e463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920";

  return (
    <section className="relative h-screen bg-black text-white">
      <img
        src={heroImage}
        alt="Luxury perfume"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="relative flex h-full items-center justify-center">
        <div className="px-4 text-center">
          <h2 className="mb-6 text-5xl tracking-widest md:text-7xl">TIMELESS LUXURY</h2>
          <p className="mb-8 text-lg tracking-wide opacity-90 md:text-xl">
            Discover our exclusive collection of fine fragrances
          </p>
          <a
            href="#products"
            className="inline-block border-2 border-white bg-white px-8 py-3 text-black transition-all duration-300 hover:bg-black hover:text-white"
          >
            EXPLORE COLLECTION
          </a>
        </div>
      </div>
    </section>
  );
}
