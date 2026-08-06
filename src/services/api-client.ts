import { notifyUnauthorized } from '../features/auth/auth-events.ts'
import { authStorage } from '../features/auth/auth-storage.ts'
import { ApiError, type ProblemDetail } from './api-error.ts'

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(
  /\/$/,
  '',
)

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  authenticated?: boolean
}

async function parseProblem(response: Response): Promise<ProblemDetail | null> {
  const contentType = response.headers.get('content-type') ?? ''

  if (!contentType.includes('json')) {
    return null
  }

  try {
    return (await response.json()) as ProblemDetail
  } catch {
    return null
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.authenticated !== false) {
    const token = authStorage.getToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  const { body, authenticated, ...requestInit } = options
  void authenticated

  const response = await fetch(`${API_URL}${path}`, {
    ...requestInit,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    const problem = await parseProblem(response)

    if (response.status === 401 && options.authenticated !== false) {
      authStorage.clearToken()
      notifyUnauthorized()
    }

    throw new ApiError(response.status, problem)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  return text ? (JSON.parse(text) as T) : (undefined as T)
}
