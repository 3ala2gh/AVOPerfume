type AdminDashboardPageProps = {
  onLogout: () => void
}

function AdminDashboardPage({ onLogout }: AdminDashboardPageProps) {
  return (
    <main className="container">
      <h1>Admin Dashboard</h1>
      <p className="lead">This area is restricted to logged in admins only.</p>
      <button
        type="button"
        onClick={onLogout}
        className="rounded-md bg-black px-4 py-2 text-white transition-opacity hover:opacity-90"
      >
        Logout
      </button>
    </main>
  )
}

export default AdminDashboardPage
