import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import type { AuthResponse } from './types/auth'
import Navbar from './components/layout/Navbar'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import OffersPage from './pages/OffersPage'
import PerfumeDetailsPage from './pages/PerfumeDetailsPage'
import ProductsPage from './pages/ProductsPage'
import ShopPage from './pages/ShopPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminOffersPage from './pages/admin/AdminOffersPage'
import { useAdminSession } from './hooks/useAdminSession'

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAdminAuthenticated, login, logout } = useAdminSession()

  const isAdminRoute = location.pathname.startsWith('/admin')
  const isAdminLoginRoute = location.pathname === '/admin/login'

  useEffect(() => {
    if (!location.hash) {
      return
    }

    const sectionId = location.hash.replace('#', '')
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.hash, location.pathname])

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main style={{ paddingTop: isAdminRoute || isAdminLoginRoute ? 0 : 64 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/perfume/:slug" element={<PerfumeDetailsPage />} />
          <Route
            path="/admin/login"
            element={
              isAdminAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <AdminLoginPage
                  onLogin={(auth: AuthResponse) => {
                    login(auth)
                    navigate('/admin', { replace: true })
                  }}
                />
              )
            }
          />
          <Route
            path="/admin"
            element={
              isAdminAuthenticated ? (
                <AdminDashboardPage
                  onLogout={() => {
                    logout()
                    navigate('/', { replace: true })
                  }}
                />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          />
          <Route
            path="/admin/offers"
            element={
              isAdminAuthenticated ? (
                <AdminOffersPage
                  onLogout={() => {
                    logout()
                    navigate('/', { replace: true })
                  }}
                />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
