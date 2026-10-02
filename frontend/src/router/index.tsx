import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import type { AuthResponse } from '../types/auth'
import { useAdminSession } from '../hooks/useAdminSession'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'
import OffersPage from '../pages/OffersPage'
import PerfumeDetailsPage from '../pages/PerfumeDetailsPage'
import ProductsPage from '../pages/ProductsPage'
import ShopPage from '../pages/ShopPage'
import AdminLayout from '../components/admin/AdminLayout'
import AdminAddPerfumePage from '../pages/admin/AdminAddPerfumePage'
import AdminBestSellersPage from '../pages/admin/AdminBestSellersPage'
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage'
import AdminDiscountsPage from '../pages/admin/AdminDiscountsPage'
import AdminLoginPage from '../pages/admin/AdminLoginPage'
import AdminOffersPage from '../pages/admin/AdminOffersPage'
import AdminOverviewPage from '../pages/admin/AdminOverviewPage'
import AdminPerfumesPage from '../pages/admin/AdminPerfumesPage'
import AdminSizesPage from '../pages/admin/AdminSizesPage'

export function AppRouter() {
  const navigate = useNavigate()
  const { isAdminAuthenticated, login, logout } = useAdminSession()

  return (
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
            <AdminLayout
              onLogout={() => {
                logout()
                navigate('/', { replace: true })
              }}
            />
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      >
        <Route index element={<AdminOverviewPage />} />
        <Route path="perfumes" element={<AdminPerfumesPage />} />
        <Route path="perfumes/new" element={<AdminAddPerfumePage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="discounts" element={<AdminDiscountsPage />} />
        <Route path="best-sellers" element={<AdminBestSellersPage />} />
        <Route path="sizes" element={<AdminSizesPage />} />
        <Route path="offers" element={<AdminOffersPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
