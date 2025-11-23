import { useEffect, useState } from 'react'
import { useApi } from '@/hooks/useApi'
import { useAuth } from '@/context/AuthContext'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { AdminUser } from '@/types/api'

export function AdminPage() {
  const { accessToken } = useAuth()
  const { request } = useApi()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [filters, setFilters] = useState({ email: '', user_type: '' })
  const [error, setError] = useState<string | null>(null)

  const loadUsers = () => {
    const params = new URLSearchParams()
    if (filters.email) params.append('email', filters.email)
    if (filters.user_type) params.append('user_type', filters.user_type)
    request<AdminUser[]>(`/api/v1/admin/users/?${params.toString()}`)
      .then((res) => {
        if (res.data) setUsers(res.data)
        if (res.error) setError(res.error)
      })
      .catch(() => setError('Failed to load users'))
  }

  useEffect(() => {
    if (accessToken) loadUsers()
  }, [accessToken])

  const toggleDisable = async (user: AdminUser, value: boolean) => {
    await request(`/api/v1/admin/users/${user.id}/`, {
      method: 'PATCH',
      body: { is_disabled_by_admin: value },
    })
    loadUsers()
  }

  if (!accessToken) {
    return <p className="text-slate-300">Admin access requires login.</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-semibold text-white">Admin</h2>
        <Input
          placeholder="Filter email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          className="w-48 bg-slate-900"
        />
        <select
          className="rounded-md bg-slate-900 px-3 py-2 text-sm"
          value={filters.user_type}
          onChange={(e) => setFilters({ ...filters, user_type: e.target.value })}
        >
          <option value="">All plans</option>
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
        </select>
        <Button size="sm" onClick={loadUsers}>
          Apply
        </Button>
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        {users.map((u) => (
          <Card key={u.id}>
            <CardHeader>
              <CardTitle>{u.email}</CardTitle>
              <CardDescription>
                Plan: {u.user_type} | Subscription: {u.subscription_status || 'n/a'}
              </CardDescription>
            </CardHeader>
            <div className="space-y-2 text-sm text-slate-200">
              <p>Apps: {u.owned_app_count}</p>
              <p>Disabled by admin: {u.is_disabled_by_admin ? 'Yes' : 'No'}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={u.is_disabled_by_admin ? 'outline' : 'destructive'}
                  onClick={() => toggleDisable(u, !u.is_disabled_by_admin)}
                >
                  {u.is_disabled_by_admin ? 'Enable' : 'Disable'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
