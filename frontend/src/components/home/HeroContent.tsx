import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import desktopHeroImage from "../../assets/Desktop Hero.png";
import mobileHeroImage from "../../assets/Mobile Hero.png";
import { useI18n } from "../../hooks/useI18n";

const rise = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0 },
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function HeroContent() {
  const { t } = useI18n();

  return (
    <section className="relative flex h-[100svh] min-h-[560px] items-center justify-center overflow-hidden bg-ink text-white">
      <picture>
        <source media="(min-width: 768px)" srcSet={desktopHeroImage} />
        <img
          src={mobileHeroImage}
          alt={t("home.heroAlt")}
          className="absolute inset-0 h-full w-full animate-ken-burns object-cover opacity-70"
          fetchPriority="high"
        />
      </picture>

      {/* Layered scrim: darkens the edges so the type stays legible over any crop. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/45 to-ink/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(11,11,12,0.72)_100%)]" />

      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.13, delayChildren: 0.15 }}
        className="relative z-10 flex flex-col items-center px-5 text-center"
      >
        <motion.p
          variants={rise}
          transition={{ duration: 0.8, ease }}
          className="mb-5 text-[11px] font-medium uppercase tracking-wider2 text-champagne-light sm:text-xs"
        >
          {t("home.customerFavorites")}
        </motion.p>

        <motion.h1
          variants={rise}
          transition={{ duration: 0.9, ease }}
          className="max-w-4xl font-display text-[2.85rem] font-light leading-[1.04] tracking-[0.04em] sm:text-7xl lg:text-[5.5rem]"
        >
          {t("home.heroTitle")}
        </motion.h1>

        <motion.div
          variants={rise}
          transition={{ duration: 0.8, ease }}
          className="my-7 h-px w-20 bg-gradient-to-r from-transparent via-champagne to-transparent sm:my-8 sm:w-28"
        />

        <motion.p
          variants={rise}
          transition={{ duration: 0.8, ease }}
          className="max-w-xl text-sm font-light leading-relaxed tracking-wide text-white/75 sm:text-base"
        >
          {t("home.heroSubtitle")}
        </motion.p>

        <motion.div
          variants={rise}
          transition={{ duration: 0.8, ease }}
          className="mt-9 flex flex-col items-center gap-3 sm:mt-11 sm:flex-row sm:gap-4"
        >
          <Link
            to="/shop"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex w-[15.5rem] items-center justify-center gap-2.5 bg-white px-9 py-4 text-[11px] font-medium uppercase tracking-luxe text-ink transition-all duration-500 ease-luxe hover:bg-champagne hover:text-white sm:w-auto"
          >
            {t("home.heroCta")}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
          <a
            href="#best-sellers"
            className="inline-flex w-[15.5rem] items-center justify-center border border-white/35 px-9 py-4 text-[11px] font-medium uppercase tracking-luxe text-white/90 backdrop-blur-sm transition-all duration-500 ease-luxe hover:border-white hover:bg-white/10 hover:text-white sm:w-auto"
          >
            {t("home.bestSellers")}
          </a>
        </motion.div>
      </motion.div>

      <a
        href="#best-sellers"
        aria-hidden="true"
        tabIndex={-1}
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
      >
        <span className="text-[10px] uppercase tracking-wider2 text-white/40">
          {t("home.bestSellers")}
        </span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/30 p-1">
          <span className="h-1.5 w-1 animate-scroll-hint rounded-full bg-white" />
        </span>
      </a>
    </section>
  );
}
