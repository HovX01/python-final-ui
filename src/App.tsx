import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { HomePage } from '@/pages/HomePage'
import { AuthPage } from '@/pages/AuthPage'
import { AppsPage } from '@/pages/AppsPage'
import { BillingPage } from '@/pages/BillingPage'
import { AdminPage } from '@/pages/AdminPage'
import { ForgotResetPage } from '@/pages/ForgotResetPage'
import { Button } from '@/components/ui/button'

function AppShell() {
  const { accessToken, logout, userEmail, loading } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="border-b border-white/5 bg-black/20 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link to="/" className="text-lg font-semibold text-white">
            Subscription Platform
          </Link>
          <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
            <Link to="/" className="hover:text-white">
              Dashboard
            </Link>
            <Link to="/apps" className="hover:text-white">
              Apps
            </Link>
            <Link to="/billing" className="hover:text-white">
              Billing
            </Link>
            <Link to="/admin" className="hover:text-white">
              Admin
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {loading ? (
              <span className="text-xs text-slate-400">Checking session...</span>
            ) : accessToken ? (
              <>
                <span className="text-xs text-slate-200">{userEmail}</span>
                <Button size="sm" variant="outline" onClick={() => logout()}>
                  Logout
                </Button>
              </>
            ) : (
              <Button size="sm" asChild>
                <Link to="/auth">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/forgot-reset" element={<ForgotResetPage />} />
          <Route path="/apps" element={<AppsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  )
}
