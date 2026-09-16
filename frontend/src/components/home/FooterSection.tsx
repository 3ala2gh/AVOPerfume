import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../../hooks/useI18n";
import { WHATSAPP_DISPLAY_NUMBER, WHATSAPP_URL } from "../../config/contact";

// lucide dropped brand marks in v1, so the Instagram glyph lives here.
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

export default function FooterSection() {
  const { t } = useI18n();

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-4 font-display text-2xl font-medium tracking-[0.3em]">
              {t("brand")}
            </h3>
            <p className="max-w-xs text-sm font-light leading-relaxed text-white/50">
              {t("home.footerTagline")}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.instagram.com/avo.perfume/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:border-champagne hover:bg-champagne hover:text-white"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:border-champagne hover:bg-champagne hover:text-white"
                aria-label={t("home.contactUs")}
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-[10px] font-medium uppercase tracking-wider2 text-champagne">
              {t("home.footerShop")}
            </h4>
            <ul className="space-y-3 text-sm font-light">
              <li>
                <Link
                  to="/shop"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="text-white/55 no-underline transition-colors hover:text-white"
                >
                  {t("home.allProducts")}
                </Link>
              </li>
              <li>
                <a
                  href="#best-sellers"
                  className="text-white/55 no-underline transition-colors hover:text-white"
                >
                  {t("home.bestSellers")}
                </a>
              </li>
              <li>
                <Link
                  to="/offers"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="text-white/55 no-underline transition-colors hover:text-white"
                >
                  {t("nav.offers")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-[10px] font-medium uppercase tracking-wider2 text-champagne">
              {t("home.footerSupport")}
            </h4>
            <ul className="space-y-3 text-sm font-light">
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/55 no-underline transition-colors hover:text-white"
                >
                  {t("home.contactUs")}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  dir="ltr"
                  className="inline-block text-white/55 no-underline transition-colors hover:text-white"
                >
                  {WHATSAPP_DISPLAY_NUMBER}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-[10px] font-medium uppercase tracking-wider2 text-champagne">
              {t("home.footerFollow")}
            </h4>
            <ul className="space-y-3 text-sm font-light">
              <li>
                <a
                  href="https://www.instagram.com/avo.perfume/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/55 no-underline transition-colors hover:text-white"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8 text-center">
          <p className="text-xs font-light tracking-wide text-white/35">
            {t("home.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
