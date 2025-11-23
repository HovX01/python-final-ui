import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useApi } from '@/hooks/useApi'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import type { Subscription } from '@/types/api'

export function HomePage() {
  const { accessToken, userEmail } = useAuth()
  const { request } = useApi()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken) {
      setSubscription(null)
      return
    }
    setLoading(true)
    request<{ subscription: Subscription | null }>('/api/v1/subscriptions/me/')
      .then((res) => {
        if (res.data) setSubscription(res.data.subscription)
        if (res.error) setError(res.error)
      })
      .finally(() => setLoading(false))
  }, [accessToken, request])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-300">
          {accessToken ? 'Authenticated session' : 'Sign in to manage subscriptions and apps'}
        </p>
      </div>

      {!accessToken && (
        <Card>
          <CardHeader className="flex flex-col gap-2">
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Login or create an account to continue.</CardDescription>
            <div className="flex gap-3">
              <Button asChild>
                <Link to="/auth">Login</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/auth#register">Register</Link>
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}

      {accessToken && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Account</CardTitle>
                <CardDescription>{userEmail}</CardDescription>
              </div>
            </CardHeader>
            <div className="space-y-2 text-sm text-slate-200">
              <p>
                Plan:{' '}
                <span className="font-semibold">
                  {subscription?.plan_id || 'basic (default)'}
                </span>
              </p>
              <p>Status: {subscription?.status || 'inactive'}</p>
              <div className="flex gap-3 pt-2">
                <Button asChild>
                  <Link to="/billing">Manage billing</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/apps">Manage apps</Link>
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/billing">Open Billing</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/forgot-reset">Reset Password</Link>
              </Button>
            </div>
            {loading && <p className="mt-4 text-sm text-slate-300">Loading subscription...</p>}
            {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
          </Card>
        </div>
      )}
    </div>
  )
}
