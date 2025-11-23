import { API_BASE_URL } from '@/config'

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export interface ApiRequestOptions extends RequestInit {
  method?: HttpMethod
  body?: any
}

export interface ApiResponse<T> {
  data: T | null
  error?: string
  status: number
}

export async function apiRequest<T>(
  path: string,
  {
    method = 'GET',
    body,
    headers,
    accessToken,
    onUnauthorized,
  }: ApiRequestOptions & { accessToken?: string | null; onUnauthorized?: () => Promise<string | null> } = {},
): Promise<ApiResponse<T>> {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`
  const init: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  }

  let response = await fetch(url, init)
  if (response.status === 401 && onUnauthorized) {
    const refreshed = await onUnauthorized()
    if (refreshed) {
      response = await fetch(url, {
        ...init,
        headers: {
          ...(init.headers as Record<string, string>),
          Authorization: `Bearer ${refreshed}`,
        },
      })
    }
  }

  const status = response.status
  let data: any = null
  try {
    data = await response.json()
  } catch (e) {
    data = null
  }

  if (!response.ok) {
    const error = (data && (data.detail || data.error)) || response.statusText
    return { data: null, error, status }
  }

  return { data, status }
}
