import heroImage from "../../assets/Avo Hero Pic.png";

export default function HeroContent() {
  return (
    <section className="relative h-screen bg-black text-white">
      <img
        src={heroImage}
        alt="Luxury perfume"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="relative flex h-full items-center justify-center">
        <div className="px-4 text-center">
          <h2 className="mb-6 text-5xl tracking-widest md:text-7xl">
            TIMELESS LUXURY
          </h2>
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
