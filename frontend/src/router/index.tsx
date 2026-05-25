import type { ReactElement } from 'react'
import HomePage from '../pages/HomePage'
import ProductsPage from '../pages/ProductsPage'
import NotFoundPage from '../pages/NotFoundPage'

const routes: Record<string, ReactElement> = {
  '/': <HomePage />,
  '/products': <ProductsPage />,
}

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }
  return pathname
}

export function AppRouter() {
  const path = normalizePath(window.location.pathname)
  return routes[path] ?? <NotFoundPage />
}
