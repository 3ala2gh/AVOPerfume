import type { FormEvent } from 'react'

type AdminLoginPageProps = {
  onLogin: () => void
}

function AdminLoginPage({ onLogin }: AdminLoginPageProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onLogin()
  }

  return (
    <main className="container">
      <h1>Admin Login</h1>
      <p className="lead">Sign in as admin to access dashboard routes.</p>
      <form onSubmit={handleSubmit} className="max-w-sm space-y-4 rounded-xl border border-black/10 bg-white/90 p-5">
        <div className="space-y-2">
          <label htmlFor="admin-email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            required
            className="w-full rounded-md border border-black/20 px-3 py-2 outline-none focus:border-black"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="admin-password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            required
            className="w-full rounded-md border border-black/20 px-3 py-2 outline-none focus:border-black"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-black px-4 py-2 text-white transition-opacity hover:opacity-90"
        >
          Login
        </button>
      </form>
    </main>
  )
}

export default AdminLoginPage
