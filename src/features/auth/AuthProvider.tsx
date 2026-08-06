import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { AUTH_UNAUTHORIZED_EVENT } from './auth-events.ts'
import { AuthContext } from './auth-context.ts'
import { authStorage } from './auth-storage.ts'

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient()
  const [token, setToken] = useState<string | null>(() => authStorage.getToken())

  const signIn = useCallback(
    (newToken: string) => {
      queryClient.clear()
      authStorage.setToken(newToken)
      setToken(newToken)
    },
    [queryClient],
  )

  const signOut = useCallback(() => {
    queryClient.clear()
    authStorage.clearToken()
    setToken(null)
  }, [queryClient])

  useEffect(() => {
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, signOut)
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, signOut)
  }, [signOut])

  const value = useMemo(
    () => ({ token, isAuthenticated: Boolean(token), signIn, signOut }),
    [signIn, signOut, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
