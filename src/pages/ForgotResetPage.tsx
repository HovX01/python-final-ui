import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ForgotResetPage() {
  const { forgotPassword, resetPassword } = useAuth()
  const [mode, setMode] = useState<'forgot' | 'reset'>('forgot')
  const [email, setEmail] = useState('')
  const [uid, setUid] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submitForgot = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)
    try {
      await forgotPassword(email)
      setMessage('If the account exists, a reset email has been sent.')
    } catch (err: any) {
      setError(err.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  const submitReset = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)
    try {
      await resetPassword({ uid: Number(uid), token, new_password: newPassword })
      setMessage('Password reset. You can now log in.')
    } catch (err: any) {
      setError(err.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex items-center gap-3">
        <Button variant={mode === 'forgot' ? 'default' : 'outline'} onClick={() => setMode('forgot')}>
          Forgot password
        </Button>
        <Button variant={mode === 'reset' ? 'default' : 'outline'} onClick={() => setMode('reset')}>
          Reset password
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{mode === 'forgot' ? 'Request reset' : 'Confirm reset'}</CardTitle>
          <CardDescription>
            {mode === 'forgot'
              ? 'Send reset instructions to your email.'
              : 'Use the uid/token from the email to set a new password.'}
          </CardDescription>
        </CardHeader>
        {mode === 'forgot' ? (
          <form className="space-y-3" onSubmit={submitForgot}>
            <div className="space-y-1">
              <label className="text-sm text-slate-200">Email</label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {error && <p className="text-sm text-red-300">{error}</p>}
            {message && <p className="text-sm text-green-300">{message}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset email'}
            </Button>
          </form>
        ) : (
          <form className="space-y-3" onSubmit={submitReset}>
            <div className="space-y-1">
              <label className="text-sm text-slate-200">UID</label>
              <Input value={uid} onChange={(e) => setUid(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-200">Token</label>
              <Input value={token} onChange={(e) => setToken(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-200">New password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-300">{error}</p>}
            {message && <p className="text-sm text-green-300">{message}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset password'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  )
}
