import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '@/api/client'

type AuthContextValue = {
  accessToken: string | null
  userEmail: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (payload: { email: string; password: string; first_name?: string; last_name?: string }) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (payload: { uid: number; token: string; new_password: string }) => Promise<void>
  refresh: () => Promise<string | null>
  setEmail: (email: string | null) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const refresh = useCallback(async () => {
    const res = await apiRequest<{ access: string }>('/api/v1/auth/token/refresh/', {
      method: 'POST',
      body: {},
    })
    if (res.data?.access) {
      setAccessToken(res.data.access)
      return res.data.access
    }
    setAccessToken(null)
    return null
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await apiRequest<{ access: string }>('/api/v1/auth/login/', {
        method: 'POST',
        body: { email, password },
      })
      if (res.data?.access) {
        setAccessToken(res.data.access)
        setUserEmail(email)
      } else {
        throw new Error(res.error || 'Login failed')
      }
    },
    [],
  )

  const logout = useCallback(async () => {
    await apiRequest('/api/v1/auth/logout/', {
      method: 'POST',
      accessToken,
    })
    setAccessToken(null)
  }, [accessToken])

  const register = useCallback(
    async (payload: { email: string; password: string; first_name?: string; last_name?: string }) => {
      const res = await apiRequest('/api/v1/auth/register/', { method: 'POST', body: payload })
      if (res.error) throw new Error(res.error)
      setUserEmail(payload.email)
    },
    [],
  )

  const forgotPassword = useCallback(async (email: string) => {
    const res = await apiRequest('/api/v1/auth/forgot-password/', { method: 'POST', body: { email } })
    if (res.error) throw new Error(res.error)
  }, [])

  const resetPassword = useCallback(
    async (payload: { uid: number; token: string; new_password: string }) => {
      const res = await apiRequest('/api/v1/auth/reset-password/', { method: 'POST', body: payload })
      if (res.error) throw new Error(res.error)
    },
    [],
  )

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [refresh])

  const value = useMemo(
    () => ({
      accessToken,
      userEmail,
      loading,
      login,
      logout,
      register,
      forgotPassword,
      resetPassword,
      refresh,
      setEmail: setUserEmail,
    }),
    [accessToken, userEmail, loading, login, logout, register, forgotPassword, resetPassword, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
