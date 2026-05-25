import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PerfumeDetailsPage from './pages/PerfumeDetailsPage'
import ProductsPage from './pages/ProductsPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'

const ADMIN_AUTH_KEY = 'avo_admin_auth'

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    () => window.localStorage.getItem(ADMIN_AUTH_KEY) === 'true',
  )

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
      {!isAdminLoginRoute && <Navbar />}
      <main style={{ paddingTop: isAdminLoginRoute ? 0 : 64 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/perfume/:slug" element={<PerfumeDetailsPage />} />
          <Route
            path="/admin/login"
            element={
              <AdminLoginPage
                onLogin={() => {
                  window.localStorage.setItem(ADMIN_AUTH_KEY, 'true')
                  setIsAdminAuthenticated(true)
                  navigate('/admin', { replace: true })
                }}
              />
            }
          />
          <Route
            path="/admin"
            element={
              isAdminAuthenticated ? (
                <AdminDashboardPage
                  onLogout={() => {
                    window.localStorage.removeItem(ADMIN_AUTH_KEY)
                    setIsAdminAuthenticated(false)
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
