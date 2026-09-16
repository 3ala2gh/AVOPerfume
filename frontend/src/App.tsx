import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import { AppRouter } from './router'

function App() {
  const location = useLocation()

  const isAdminRoute = location.pathname.startsWith('/admin')
  const isAdminLoginRoute = location.pathname === '/admin/login'
  // The home hero runs full-bleed beneath the transparent navbar.
  const isHomeRoute = location.pathname === '/'

  useEffect(() => {
    if (location.hash) {
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname, location.hash])

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
      <main
        style={{
          paddingTop: isAdminRoute || isAdminLoginRoute || isHomeRoute ? 0 : 72,
        }}
      >
        <AppRouter />
      </main>
    </>
  )
}

export default App
