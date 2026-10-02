import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CirclePlus,
  Image,
  Percent,
  Rocket,
  Ruler,
  SprayCan,
  Star,
  Tags,
  type LucideIcon,
} from 'lucide-react'
import AdminPanel from '../../components/admin/AdminPanel'
import { useCategoriesQuery } from '../../hooks/useCategoriesQuery'
import { useOffersQuery } from '../../hooks/useOffersQuery'
import { useProductsQuery } from '../../hooks/useProductsQuery'
import { useI18n } from '../../hooks/useI18n'

type Stat = {
  labelKey: string
  value: number | undefined
  icon: LucideIcon
  to: string
}

const QUICK_ACTIONS: { to: string; key: string; icon: LucideIcon }[] = [
  { to: '/admin/perfumes/new', key: 'addPerfume', icon: CirclePlus },
  { to: '/admin/perfumes', key: 'perfumes', icon: SprayCan },
  { to: '/admin/discounts', key: 'discounts', icon: Percent },
  { to: '/admin/best-sellers', key: 'bestSellers', icon: Star },
  { to: '/admin/offers', key: 'offers', icon: Image },
  { to: '/admin/sizes', key: 'sizes', icon: Ruler },
]

function AdminOverviewPage() {
  const { t } = useI18n()
  const { data: products } = useProductsQuery({ source: 'admin' })
  const { data: categories } = useCategoriesQuery({ source: 'admin' })
  const { data: offers } = useOffersQuery({ source: 'admin' })

  const stats: Stat[] = [
    { labelKey: 'admin.stats.perfumes', value: products?.length, icon: SprayCan, to: '/admin/perfumes' },
    { labelKey: 'admin.stats.categories', value: categories?.length, icon: Tags, to: '/admin/categories' },
    {
      labelKey: 'admin.stats.onSale',
      value: products?.filter((product) => Boolean(product.discountPercent)).length,
      icon: Percent,
      to: '/admin/discounts',
    },
    {
      labelKey: 'admin.stats.bestSellers',
      value: products?.filter((product) => product.isBestSeller).length,
      icon: Star,
      to: '/admin/best-sellers',
    },
    { labelKey: 'admin.stats.offers', value: offers?.length, icon: Image, to: '/admin/offers' },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
        {stats.map(({ labelKey, value, icon: Icon, to }) => (
          <Link
            key={labelKey}
            to={to}
            className="group rounded-2xl border border-ink/[0.08] bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-champagne/40 hover:shadow-card sm:p-5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-champagne/15 text-champagne-dark">
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <p className="mt-4 text-2xl font-semibold tabular-nums text-ink sm:text-3xl">
              {value ?? <span className="inline-block h-7 w-10 animate-pulse rounded bg-ink/[0.06] align-middle" />}
            </p>
            <p className="mt-0.5 text-sm text-ink-muted">{t(labelKey)}</p>
          </Link>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-6">
        <AdminPanel title={t('admin.quickActions')}>
          <div className="grid grid-cols-1 gap-2 min-[480px]:grid-cols-2">
            {QUICK_ACTIONS.map(({ to, key, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="group flex items-center gap-3 rounded-xl border border-ink/[0.08] p-3.5 transition-colors hover:border-champagne/40 hover:bg-champagne/[0.04]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sand text-ink transition-colors group-hover:bg-champagne group-hover:text-white">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-ink">{t(`admin.nav.${key}`)}</span>
                  <span className="line-clamp-1 block text-xs text-ink-muted">{t(`admin.pages.${key}`)}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:text-champagne rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </Link>
            ))}
          </div>
        </AdminPanel>

        <section className="h-fit rounded-2xl bg-ink p-5 text-white sm:p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-champagne/20 text-champagne-light">
            <Rocket className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-base font-semibold">{t('admin.howPublishTitle')}</h2>
          <ol className="mt-4 space-y-3">
            {['admin.howPublishStep1', 'admin.howPublishStep2', 'admin.howPublishStep3'].map((key, index) => (
              <li key={key} className="flex gap-3 text-sm text-white/75">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-champagne/50 text-xs font-semibold text-champagne-light">
                  {index + 1}
                </span>
                <span className="pt-0.5">{t(key)}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}

export default AdminOverviewPage
