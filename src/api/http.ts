import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '../auth/storage'
import { getRuntimeApiBaseUrl } from '../config/runtime'

export type HttpMethod = 'GET' | 'POST'

type RefreshResponse = {
  accessToken: string
  refreshToken: string
}

function mobileDevSecret(): string | undefined {
  const v = process.env.EXPO_PUBLIC_CEBOS_MOBILE_DEV_SECRET
  return typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined
}

export async function apiFetch<T>(
  path: string,
  method: HttpMethod,
  options: {
    body?: unknown
    auth?: boolean
    mobileDevSecretHeader?: boolean
  } = {},
): Promise<T> {
  const base = getRuntimeApiBaseUrl()
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`
  const makeHeaders = (accessToken?: string | null): Record<string, string> => {
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json'
    }
    if (options.auth !== false && accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }
    if (options.mobileDevSecretHeader) {
      const secret = mobileDevSecret()
      if (secret) {
        headers['X-CEBOS-Mobile-Dev-Secret'] = secret
      }
    }
    return headers
  }
  const request = async (accessToken?: string | null) =>
    fetch(url, {
      method,
      headers: makeHeaders(accessToken),
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    })

  const currentAccess = options.auth === false ? null : await getAccessToken()
  let res = await request(currentAccess)
  if (res.status === 401 && options.auth !== false) {
    const refreshed = await rotateRefreshToken(base)
    if (refreshed) {
      res = await request(refreshed.accessToken)
    } else {
      await clearTokens()
    }
  }
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${res.status} ${text}`)
  }
  if (res.status === 204) {
    return undefined as T
  }
  return (await res.json()) as T
}

async function rotateRefreshToken(baseUrl: string): Promise<RefreshResponse | null> {
  const refreshToken = await getRefreshToken()
  if (!refreshToken) {
    return null
  }
  const res = await fetch(`${baseUrl}/auth/refresh`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  })
  if (!res.ok) {
    return null
  }
  const body = (await res.json()) as RefreshResponse
  await setTokens(body.accessToken, body.refreshToken)
  return body
}
