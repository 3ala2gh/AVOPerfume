import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import {
  CirclePlus,
  Image,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  Percent,
  Rocket,
  Ruler,
  SprayCan,
  Star,
  Store,
  Tags,
  X,
  type LucideIcon,
} from 'lucide-react'
import { usePublishWebsiteMutation } from '../../hooks/usePublishWebsiteMutation'
import { useI18n } from '../../hooks/useI18n'
import { cn } from '../../utils/cn'
import AdminButton from './AdminButton'

type AdminLayoutProps = {
  onLogout: () => void
}

type NavItem = {
  to: string
  key: string
  icon: LucideIcon
}

type NavGroup = {
  labelKey?: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  { items: [{ to: '/admin', key: 'overview', icon: LayoutDashboard }] },
  {
    labelKey: 'admin.nav.catalog',
    items: [
      { to: '/admin/perfumes', key: 'perfumes', icon: SprayCan },
      { to: '/admin/perfumes/new', key: 'addPerfume', icon: CirclePlus },
      { to: '/admin/categories', key: 'categories', icon: Tags },
    ],
  },
  {
    labelKey: 'admin.nav.marketing',
    items: [
      { to: '/admin/discounts', key: 'discounts', icon: Percent },
      { to: '/admin/best-sellers', key: 'bestSellers', icon: Star },
      { to: '/admin/offers', key: 'offers', icon: Image },
    ],
  },
  {
    labelKey: 'admin.nav.settings',
    items: [{ to: '/admin/sizes', key: 'sizes', icon: Ruler }],
  },
]

const ALL_NAV_ITEMS = NAV_GROUPS.flatMap((group) => group.items)

export default function AdminLayout({ onLogout }: AdminLayoutProps) {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { mutateAsync: publishWebsite, isPending: isPublishing } = usePublishWebsiteMutation()

  const normalizedPath = pathname.replace(/\/+$/, '') || '/admin'
  const currentItem = ALL_NAV_ITEMS.find((item) => item.to === normalizedPath) ?? ALL_NAV_ITEMS[0]

  async function handlePublish() {
    try {
      await publishWebsite()
      toast.success(t('admin.publishTriggered'))
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('admin.publishError'))
    }
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 pb-4 pt-6">
        <Link to="/admin" onClick={() => setIsDrawerOpen(false)} className="block">
          <p className="font-display text-xl tracking-luxe text-ink">{t('brand')}</p>
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-champagne">
            {t('admin.adminPanel')}
          </p>
        </Link>
        <button
          type="button"
          onClick={() => setIsDrawerOpen(false)}
          aria-label={t('admin.closeMenu')}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-sand lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        {NAV_GROUPS.map((group, index) => (
          <div key={group.labelKey ?? index}>
            {group.labelKey ? (
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/40">
                {t(group.labelKey)}
              </p>
            ) : null}
            <ul className="space-y-0.5">
              {group.items.map(({ to, key, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end
                    onClick={() => setIsDrawerOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-sand text-ink before:absolute before:inset-y-2 before:start-0 before:w-[3px] before:rounded-full before:bg-champagne'
                          : 'text-ink-muted hover:bg-sand/60 hover:text-ink',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={cn('h-[18px] w-[18px]', isActive ? 'text-champagne-dark' : 'text-ink/45')} />
                        {t(`admin.nav.${key}`)}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-0.5 border-t border-ink/[0.06] p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-sand/60 hover:text-ink"
        >
          <Store className="h-[18px] w-[18px] text-ink/45" />
          {t('common.viewStore')}
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-[18px] w-[18px] rtl:rotate-180" />
          {t('admin.logout')}
        </button>
      </div>
    </div>
  )

  return (
    <div className="admin-ui min-h-screen bg-ivory text-ink">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 start-0 z-30 hidden w-64 border-e border-ink/[0.08] bg-white lg:block">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px] transition-opacity lg:hidden',
          isDrawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={cn(
          'fixed inset-y-0 start-0 z-50 w-72 max-w-[85vw] bg-white shadow-lift transition-[transform,visibility] duration-300 ease-luxe lg:hidden',
          isDrawerOpen ? 'visible translate-x-0' : 'invisible ltr:-translate-x-full rtl:translate-x-full',
        )}
      >
        {sidebar}
      </aside>

      <div className="lg:ps-64">
        <header className="sticky top-0 z-20 border-b border-ink/[0.08] bg-ivory/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label={t('admin.menu')}
              className="-ms-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ink hover:bg-sand lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-semibold text-ink sm:text-xl">
                {t(`admin.nav.${currentItem.key}`)}
              </h1>
              <p className="hidden truncate text-sm text-ink-muted sm:block">
                {t(`admin.pages.${currentItem.key}`)}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <p className="hidden max-w-[15rem] items-start gap-1.5 text-xs leading-snug text-ink-muted xl:flex">
                <Info className="mt-px h-3.5 w-3.5 shrink-0 text-champagne" />
                {t('admin.publishHint')}
              </p>
              <AdminButton
                variant="accent"
                icon={Rocket}
                isLoading={isPublishing}
                onClick={() => void handlePublish()}
                title={t('admin.publishHint')}
                aria-label={t('admin.publishWebsite')}
              >
                <span className="hidden sm:inline">
                  {isPublishing ? t('admin.publishing') : t('admin.publishWebsite')}
                </span>
              </AdminButton>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
