import { Navigate, Outlet } from 'react-router'
import { useAuth } from './useAuth.ts'

export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />
  }

  return <Outlet />
}
