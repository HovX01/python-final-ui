import { useCallback } from 'react'
import type { ApiRequestOptions } from '@/api/client'
import { apiRequest } from '@/api/client'
import { useAuth } from '@/context/AuthContext'

export function useApi() {
  const { accessToken, refresh } = useAuth()

  const request = useCallback(
    async <T,>(path: string, options: ApiRequestOptions = {}) => {
      return apiRequest<T>(path, {
        ...options,
        accessToken,
        onUnauthorized: refresh,
      })
    },
    [accessToken, refresh],
  )

  return { request }
}
