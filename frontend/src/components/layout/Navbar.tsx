import { Languages, Menu, Search, ShoppingCart, X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { findPerfumeByQuery, perfumeToSlug, toPerfumes } from '../home/catalogData'
import { useProductsQuery } from '../../hooks/useProductsQuery'
import { useCart } from '../../hooks/useCart'
import CartDrawer from './CartDrawer'
import { useI18n } from '../../hooks/useI18n'
import { cn } from '../../utils/cn'
import { getOptimizedCloudinaryUrl } from '../../utils/cloudinary'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { data: products = [] } = useProductsQuery()
  const { totalItems } = useCart()
  const { t, toggleLanguage } = useI18n()
  const perfumes = toPerfumes(products)
  const navigate = useNavigate()
  const location = useLocation()
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const searchMatches =
    normalizedQuery.length === 0
      ? []
      : perfumes
          .filter((perfume) => perfume.name.toLowerCase().includes(normalizedQuery))
          .slice(0, 5)

  // The home hero is full-bleed, so the bar floats over it until the user scrolls.
  const isOverHero = location.pathname === '/'
  const isSolid = !isOverHero || isScrolled || isMenuOpen || isMobileSearchOpen

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 24)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function goToPerfume(name: string) {
    setSearchQuery('')
    setIsMobileSearchOpen(false)
    setIsMenuOpen(false)
    navigate(`/perfume/${perfumeToSlug(name)}`)
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const perfume = findPerfumeByQuery(perfumes, searchQuery)
    if (!perfume) {
      return
    }
    goToPerfume(perfume.name)
  }

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/shop', label: t('nav.shop') },
    { to: '/offers', label: t('nav.offers') },
  ]

  return (
    <nav
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-500 ease-luxe',
        isSolid
          ? 'border-b border-ink/10 bg-ivory/85 text-ink backdrop-blur-xl'
          : 'border-b border-white/10 bg-transparent text-white',
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            'flex items-center justify-between transition-all duration-500 ease-luxe',
            isScrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20',
          )}
        >
          <div className="flex items-center gap-4 sm:gap-10">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="whitespace-nowrap font-display text-xl font-medium tracking-[0.3em] text-inherit no-underline transition-opacity hover:opacity-70 sm:text-2xl"
            >
              {t('brand')}
            </Link>

            <div className="hidden items-center gap-9 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() =>
                    link.to === '/' && window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                  data-active={location.pathname === link.to}
                  className="link-underline text-[11px] font-medium uppercase tracking-luxe text-inherit no-underline opacity-80 transition-opacity hover:opacity-100 data-[active=true]:opacity-100"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
              <Search
                className={cn(
                  'pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors',
                  isSolid ? 'text-ink/40' : 'text-white/60',
                )}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('shop.searchPerfumesPlaceholder')}
                className={cn(
                  'w-48 rounded-full border py-2 pl-9 pr-4 text-xs font-light tracking-wide outline-none transition-all duration-500 ease-luxe focus:w-60',
                  isSolid
                    ? 'border-ink/15 bg-ink/[0.03] text-ink placeholder:text-ink/40 focus:border-champagne focus:bg-white'
                    : 'border-white/25 bg-white/10 text-white backdrop-blur-sm placeholder:text-white/50 focus:border-white/60 focus:bg-white/15',
                )}
              />
              {searchMatches.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-ink/10 bg-ivory shadow-lift">
                  {searchMatches.map((perfume) => (
                    <button
                      key={perfume.name}
                      type="button"
                      onClick={() => goToPerfume(perfume.name)}
                      className="flex w-full items-center gap-3 border-b border-ink/5 px-3 py-2.5 text-left text-xs text-ink transition-colors last:border-b-0 hover:bg-sand"
                    >
                      <img
                        src={getOptimizedCloudinaryUrl(perfume.image, { width: 100 })}
                        alt={perfume.name}
                        className="h-11 w-11 flex-shrink-0 rounded-lg bg-sand object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="line-clamp-1 tracking-wide">{perfume.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </form>

            <button
              type="button"
              onClick={toggleLanguage}
              className={cn(
                'group inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[10px] font-medium uppercase tracking-widest transition-all duration-300',
                isSolid
                  ? 'border-ink/15 text-ink hover:border-champagne hover:bg-champagne hover:text-white'
                  : 'border-white/25 text-white hover:border-white hover:bg-white hover:text-ink',
              )}
              aria-label={t('language.label')}
            >
              <Languages className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{t('language.switchTo')}</span>
              <span className="sm:hidden">
                {t('language.switchTo') === 'English' ? 'EN' : 'ع'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMobileSearchOpen((open) => !open)
                setIsMenuOpen(false)
              }}
              className="inline-flex h-9 w-9 items-center justify-center text-inherit transition-opacity hover:opacity-60 md:hidden"
              aria-label={t('common.search')}
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                setIsCartOpen(true)
                setIsMenuOpen(false)
                setIsMobileSearchOpen(false)
              }}
              className="relative inline-flex h-9 w-9 items-center justify-center text-inherit transition-opacity hover:opacity-60"
              aria-label={t('common.openCart')}
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute right-0 top-0 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-champagne px-1 text-[9px] font-medium text-white">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen((open) => !open)
                setIsMobileSearchOpen(false)
              }}
              className="inline-flex h-9 w-9 items-center justify-center text-inherit transition-opacity hover:opacity-60 md:hidden"
              aria-label={t('common.openMenu')}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMobileSearchOpen && (
          <div className="border-t border-ink/10 py-4 md:hidden">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('shop.typePerfumePlaceholder')}
                className="min-w-0 flex-1 rounded-full border border-ink/15 bg-ink/[0.03] px-4 py-2.5 text-sm font-light outline-none transition-colors focus:border-champagne focus:bg-white"
              />
              <button
                type="submit"
                className="rounded-full bg-ink px-5 py-2.5 text-[11px] font-medium uppercase tracking-luxe text-white transition-colors hover:bg-champagne"
              >
                {t('common.search')}
              </button>
            </form>
            {searchMatches.length > 0 && (
              <div className="mt-3 overflow-hidden rounded-xl border border-ink/10 bg-white">
                {searchMatches.map((perfume) => (
                  <button
                    key={perfume.name}
                    type="button"
                    onClick={() => goToPerfume(perfume.name)}
                    className="flex w-full items-center gap-3 border-b border-ink/5 px-3 py-2.5 text-left text-sm transition-colors last:border-b-0 hover:bg-sand"
                  >
                    <img
                      src={getOptimizedCloudinaryUrl(perfume.image, { width: 100 })}
                      alt={perfume.name}
                      className="h-11 w-11 flex-shrink-0 rounded-lg bg-sand object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="line-clamp-1">{perfume.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {isMenuOpen && (
          <div className="border-t border-ink/10 py-5 md:hidden">
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => {
                    setIsMenuOpen(false)
                    if (link.to === '/') {
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  }}
                  className="border-b border-ink/5 py-3 text-xs font-medium uppercase tracking-luxe text-ink no-underline transition-colors hover:text-champagne"
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false)
                  setIsCartOpen(true)
                }}
                className="py-3 text-left text-xs font-medium uppercase tracking-luxe text-ink transition-colors hover:text-champagne"
              >
                {t('nav.cart')} {totalItems > 0 ? `(${totalItems})` : ''}
              </button>
            </div>
          </div>
        )}
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  )
}
