import { Menu, Search, ShoppingCart } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { findPerfumeByQuery, perfumeToSlug, toPerfumes } from '../home/catalogData'
import { useProductsQuery } from '../../hooks/useProductsQuery'
import { useCart } from '../../context/cart-context'
import CartDrawer from './CartDrawer'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { data: products = [] } = useProductsQuery()
  const { totalItems } = useCart()
  const perfumes = toPerfumes(products)
  const navigate = useNavigate()
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const searchMatches =
    normalizedQuery.length === 0
      ? []
      : perfumes
          .filter((perfume) => perfume.name.toLowerCase().includes(normalizedQuery))
          .slice(0, 5)

  function goToPerfume(name: string) {
    setSearchQuery('')
    setIsMobileSearchOpen(false)
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

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-black/10 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-8">
            <h1 className="m-0 whitespace-nowrap text-lg tracking-[0.08em] text-[#111] sm:text-2xl">
              <Link
                to="/"
                onClick={() => {
                  setIsMenuOpen(false)
                  setIsMobileSearchOpen(false)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="rounded-sm text-inherit no-underline outline-none focus-visible:ring-2 focus-visible:ring-black/40"
              >
                AVO PERFUME
              </Link>
            </h1>

            <div className="hidden gap-8 md:flex">
              <Link
                to="/"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-[#111] transition-opacity hover:opacity-60"
              >
                Home
              </Link>
              <Link to="/shop" className="text-[#111] transition-opacity hover:opacity-60">
                Shop
              </Link>
              <Link to="/offers" className="text-[#111] transition-opacity hover:opacity-60">
                Offers
              </Link>
              <Link
                to="/admin/login"
                className="text-[#111] transition-opacity hover:opacity-60"
              >
                Admin
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => {
                setIsCartOpen(true)
                setIsMenuOpen(false)
                setIsMobileSearchOpen(false)
              }}
              className="relative inline-flex items-center text-[#111] transition-opacity hover:opacity-60"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] text-white">
                  {totalItems}
                </span>
              )}
            </button>
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 opacity-40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search perfumes..."
                className="w-64 border border-black/20 py-2 pl-10 pr-4 outline-none focus:border-black"
              />
              {searchMatches.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 border border-black/15 bg-white shadow-sm">
                  {searchMatches.map((perfume) => (
                    <button
                      key={perfume.name}
                      type="button"
                      onClick={() => goToPerfume(perfume.name)}
                      className="flex w-full items-center gap-3 border-b border-black/10 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-black hover:text-white"
                    >
                      <img
                        src={perfume.image}
                        alt={perfume.name}
                        className="h-10 w-10 flex-shrink-0 rounded-sm object-cover"
                      />
                      <span className="line-clamp-1">{perfume.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </form>

            <button
              type="button"
              onClick={() => {
                setIsMobileSearchOpen((open) => !open)
                setIsMenuOpen(false)
              }}
              className="cursor-pointer border-0 bg-transparent p-0 leading-none md:hidden"
              aria-label="Search perfume"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen((open) => !open)
                setIsMobileSearchOpen(false)
              }}
              className="cursor-pointer border-0 bg-transparent p-0 leading-none md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isMobileSearchOpen && (
          <div className="border-t border-black/10 py-4 md:hidden">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Type perfume name..."
                className="min-w-0 flex-1 border border-black/20 px-3 py-2 outline-none focus:border-black"
              />
              <button
                type="submit"
                className="border border-black px-4 py-2 transition-all hover:bg-black hover:text-white"
              >
                Search
              </button>
            </form>
            {searchMatches.length > 0 && (
              <div className="mt-2 border border-black/15 bg-white">
                {searchMatches.map((perfume) => (
                  <button
                    key={perfume.name}
                    type="button"
                    onClick={() => goToPerfume(perfume.name)}
                    className="flex w-full items-center gap-3 border-b border-black/10 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-black hover:text-white"
                  >
                    <img
                      src={perfume.image}
                      alt={perfume.name}
                      className="h-10 w-10 flex-shrink-0 rounded-sm object-cover"
                    />
                    <span className="line-clamp-1">{perfume.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {isMenuOpen && (
          <div className="border-t border-black/10 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                onClick={() => {
                  setIsMenuOpen(false)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                Home
              </Link>
              <Link to="/shop" onClick={() => setIsMenuOpen(false)}>
                Shop
              </Link>
              <Link to="/offers" onClick={() => setIsMenuOpen(false)}>
                Offers
              </Link>
              <Link to="/admin/login" onClick={() => setIsMenuOpen(false)}>
                Admin
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false)
                  setIsCartOpen(true)
                }}
                className="text-left"
              >
                Cart {totalItems > 0 ? `(${totalItems})` : ''}
              </button>
            </div>
          </div>
        )}
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  )
}
