import { createBrowserRouter, Navigate } from 'react-router'
import { AppLayout } from '../components/AppLayout.tsx'
import { ProtectedRoute } from '../features/auth/ProtectedRoute.tsx'
import { PublicOnlyRoute } from '../features/auth/PublicOnlyRoute.tsx'
import { DashboardPage } from '../pages/DashboardPage.tsx'
import { LoginPage } from '../pages/LoginPage.tsx'
import { NotFoundPage } from '../pages/NotFoundPage.tsx'
import { RegisterPage } from '../pages/RegisterPage.tsx'
import { TransactionsPage } from '../pages/TransactionsPage.tsx'

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/cadastro', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/app',
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'transacoes', element: <TransactionsPage /> },
        ],
      },
    ],
  },
  { path: '/', element: <Navigate to="/app/dashboard" replace /> },
  { path: '*', element: <NotFoundPage /> },
])
