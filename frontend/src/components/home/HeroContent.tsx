import desktopHeroImage from "../../assets/Desktop Hero.png";
import mobileHeroImage from "../../assets/Mobile Hero.png";
import { useI18n } from "../../hooks/useI18n";

export default function HeroContent() {
  const { t } = useI18n();

  return (
    <section className="relative h-screen bg-black text-white">
      <picture>
        <source media="(min-width: 768px)" srcSet={desktopHeroImage} />
        <img
          src={mobileHeroImage}
          alt={t("home.heroAlt")}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
      </picture>
      <div className="relative flex h-full items-center justify-center">
        <div className="px-4 text-center">
          <h2 className="mb-6 text-5xl tracking-widest md:text-7xl">
            {t("home.heroTitle")}
          </h2>
          <p className="mb-8 text-lg tracking-wide opacity-90 md:text-xl">
            {t("home.heroSubtitle")}
          </p>
          <a
            href="#products"
            className="inline-block border-2 border-white bg-white px-8 py-3 text-black transition-all duration-300 hover:bg-black hover:text-white"
          >
            {t("home.heroCta")}
          </a>
        </div>
      </div>
    </section>
  );
}
