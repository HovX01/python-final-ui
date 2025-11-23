import { useEffect, useState } from 'react'
import { useApi } from '@/hooks/useApi'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Subscription } from '@/types/api'

export function BillingPage() {
  const { accessToken } = useAuth()
  const { request } = useApi()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSubscription = () => {
    if (!accessToken) return
    setLoading(true)
    request<{ subscription: Subscription | null }>('/api/v1/subscriptions/me/')
      .then((res) => {
        if (res.data) setSubscription(res.data.subscription)
        if (res.error) setError(res.error)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadSubscription()
  }, [accessToken])

  const startCheckout = async (plan_id: 'basic' | 'pro') => {
    setError(null)
    const res = await request<{ checkout_url: string }>('/api/v1/subscriptions/stripe/checkout/', {
      method: 'POST',
      body: { plan_id },
    })
    if (res.data?.checkout_url) {
      window.location.href = res.data.checkout_url
    } else {
      setError(res.error || 'Failed to create checkout session')
    }
  }

  const openPortal = async () => {
    const res = await request<{ portal_url: string }>('/api/v1/subscriptions/stripe/portal/', {
      method: 'POST',
    })
    if (res.data?.portal_url) {
      window.location.href = res.data.portal_url
    } else {
      setError(res.error || 'Failed to create portal session')
    }
  }

  if (!accessToken) {
    return <p className="text-slate-300">Login to manage billing.</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-white">Billing</h2>
      {loading && <p className="text-sm text-slate-300">Loading subscription...</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Current plan</CardTitle>
          <CardDescription>Subscription synced with Stripe.</CardDescription>
        </CardHeader>
        <div className="space-y-2 text-sm text-slate-200">
          <p>Plan: {subscription?.plan_id || 'basic (default)'}</p>
          <p>Status: {subscription?.status || 'inactive'}</p>
          <p>
            Renews:{' '}
            {subscription?.current_period_end
              ? new Date(subscription.current_period_end).toLocaleDateString()
              : 'n/a'}
          </p>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upgrade to Pro</CardTitle>
            <CardDescription>Higher app limits and features.</CardDescription>
          </CardHeader>
          <Button onClick={() => startCheckout('pro')}>Start checkout</Button>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manage in Stripe</CardTitle>
            <CardDescription>Update payment method, cancel, or change plan.</CardDescription>
          </CardHeader>
          <Button variant="outline" onClick={openPortal}>
            Open billing portal
          </Button>
        </Card>
      </div>
    </div>
  )
}
