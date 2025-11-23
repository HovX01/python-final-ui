import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useApi } from '@/hooks/useApi'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { AppItem, Collaborator } from '@/types/api'

export function AppsPage() {
  const { accessToken } = useAuth()
  const { request } = useApi()
  const [apps, setApps] = useState<AppItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newApp, setNewApp] = useState({ name: '', description: '' })
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [collabForm, setCollabForm] = useState({ email: '', role: 'viewer' })
  const [collabError, setCollabError] = useState<string | null>(null)

  const fetchApps = () => {
    setLoading(true)
    request<AppItem[]>('/api/v1/apps/')
      .then((res) => {
        if (res.data) setApps(res.data)
        if (res.error) setError(res.error)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (accessToken) fetchApps()
  }, [accessToken])

  const createApp = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const res = await request<AppItem>('/api/v1/apps/', { method: 'POST', body: newApp })
    if (res.error) {
      setError(res.error)
      return
    }
    setNewApp({ name: '', description: '' })
    fetchApps()
  }

  const deleteApp = async (id: number) => {
    await request(`/api/v1/apps/${id}/`, { method: 'DELETE' })
    setSelectedApp(null)
    fetchApps()
  }

  const loadCollaborators = async (app: AppItem) => {
    setSelectedApp(app)
    const res = await request<Collaborator[]>(`/api/v1/apps/${app.id}/collaborators/`)
    if (res.data) setCollaborators(res.data)
    else setCollaborators([])
  }

  const addCollaborator = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedApp) return
    setCollabError(null)
    const res = await request(`/api/v1/apps/${selectedApp.id}/collaborators/`, {
      method: 'POST',
      body: collabForm,
    })
    if (res.error) {
      setCollabError(res.error)
    } else {
      setCollabForm({ email: '', role: 'viewer' })
      loadCollaborators(selectedApp)
    }
  }

  const removeCollaborator = async (userId: number) => {
    if (!selectedApp) return
    await request(`/api/v1/apps/${selectedApp.id}/collaborators/${userId}/`, { method: 'DELETE' })
    loadCollaborators(selectedApp)
  }

  if (!accessToken) {
    return <p className="text-slate-300">Login to manage your apps.</p>
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Your apps</h2>
          <Button onClick={fetchApps} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
        {loading && <p className="text-sm text-slate-300">Loading...</p>}
        {error && <p className="text-sm text-red-300">{error}</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          {apps.map((app) => (
            <Card key={app.id} className="space-y-2">
              <CardHeader>
                <div>
                  <CardTitle>{app.name}</CardTitle>
                  <CardDescription>{app.description}</CardDescription>
                </div>
                <p className="text-xs text-slate-300 uppercase">Role: {app.role}</p>
              </CardHeader>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => loadCollaborators(app)}>
                  Collaborators
                </Button>
                {app.role === 'owner' && (
                  <Button size="sm" variant="destructive" onClick={() => deleteApp(app.id)}>
                    Delete
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create app</CardTitle>
            <CardDescription>Counts toward your plan limit.</CardDescription>
          </CardHeader>
          <form className="space-y-3" onSubmit={createApp}>
            <div className="space-y-1">
              <label className="text-sm text-slate-200">Name</label>
              <Input value={newApp.name} onChange={(e) => setNewApp({ ...newApp, name: e.target.value })} required />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-200">Description</label>
              <Input
                value={newApp.description}
                onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
              />
            </div>
            <Button type="submit">Create</Button>
          </form>
        </Card>

        {selectedApp && (
          <Card>
            <CardHeader>
              <CardTitle>Collaborators for {selectedApp.name}</CardTitle>
              <CardDescription>Owner only actions.</CardDescription>
            </CardHeader>
            <div className="space-y-3">
              {collaborators.length === 0 && <p className="text-sm text-slate-300">No collaborators yet.</p>}
              {collaborators.map((c) => (
                <div key={c.user} className="flex items-center justify-between rounded-lg border border-white/10 p-2">
                  <div>
                    <p className="text-sm text-white">{c.email}</p>
                    <p className="text-xs text-slate-300">Role: {c.role}</p>
                  </div>
                  {c.role !== 'owner' && (
                    <Button size="sm" variant="destructive" onClick={() => removeCollaborator(c.user)}>
                      Remove
                    </Button>
                  )}
                </div>
              ))}

              <form className="space-y-2" onSubmit={addCollaborator}>
                <div className="space-y-1">
                  <label className="text-sm text-slate-200">Email</label>
                  <Input
                    value={collabForm.email}
                    onChange={(e) => setCollabForm({ ...collabForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-slate-200">Role</label>
                  <select
                    className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm"
                    value={collabForm.role}
                    onChange={(e) => setCollabForm({ ...collabForm, role: e.target.value })}
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>
                {collabError && <p className="text-sm text-red-300">{collabError}</p>}
                <Button type="submit">Add collaborator</Button>
              </form>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
