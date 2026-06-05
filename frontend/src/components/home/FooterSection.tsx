import { useI18n } from '../../i18n'

export default function FooterSection() {
  const { t } = useI18n()

  return (
    <footer className="bg-black py-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <h5 className="mb-4 text-xl tracking-wider">{t('brand')}</h5>
            <p className="text-sm opacity-60">{t('home.footerTagline')}</p>
          </div>

          <div>
            <h6 className="mb-4 tracking-wide">{t('home.footerShop')}</h6>
            <ul className="space-y-2 text-sm opacity-60">
              <li><a href="#products" className="transition-opacity hover:opacity-100">{t('home.allProducts')}</a></li>
              <li><a href="#categories" className="transition-opacity hover:opacity-100">{t('home.collections')}</a></li>
              <li><a href="#" className="transition-opacity hover:opacity-100">{t('home.newArrivals')}</a></li>
              <li><a href="#" className="transition-opacity hover:opacity-100">{t('home.bestSellers')}</a></li>
            </ul>
          </div>

          <div>
            <h6 className="mb-4 tracking-wide">{t('home.footerSupport')}</h6>
            <ul className="space-y-2 text-sm opacity-60">
              <li><a href="#" className="transition-opacity hover:opacity-100">{t('home.contactUs')}</a></li>
              <li><a href="#" className="transition-opacity hover:opacity-100">{t('home.shippingInfo')}</a></li>
              <li><a href="#" className="transition-opacity hover:opacity-100">{t('home.returns')}</a></li>
              <li><a href="#" className="transition-opacity hover:opacity-100">{t('home.faq')}</a></li>
            </ul>
          </div>

          <div>
            <h6 className="mb-4 tracking-wide">{t('home.footerFollow')}</h6>
            <ul className="space-y-2 text-sm opacity-60">
              <li>
                <a
                  href="https://www.instagram.com/avo.perfume/"
                  className="transition-opacity hover:opacity-100"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm opacity-60">
          <p>{t('home.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
