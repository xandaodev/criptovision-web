import { NavLink, Outlet } from 'react-router'
import { Brand } from './Brand.tsx'
import { useAuth } from '../features/auth/useAuth.ts'

export function AppLayout() {
  const { signOut } = useAuth()

  return (
    <div className="app-shell">
      <header className="app-header">
        <Brand />
        <nav className="app-nav" aria-label="Navegação principal">
          <NavLink to="/app/dashboard">Dashboard</NavLink>
          <NavLink to="/app/transacoes">Transações</NavLink>
        </nav>
        <button className="button button--ghost" type="button" onClick={signOut}>
          Sair
        </button>
      </header>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
}
