import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { TestProviders } from '../../test/test-utils.tsx'
import { authStorage } from './auth-storage.ts'
import { ProtectedRoute } from './ProtectedRoute.tsx'

describe('ProtectedRoute', () => {
  it('redireciona visitantes sem token para o login', () => {
    render(
      <TestProviders>
        <MemoryRouter initialEntries={['/app']}>
          <Routes>
            <Route path="/login" element={<h1>Página de login</h1>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/app" element={<h1>Área protegida</h1>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </TestProviders>,
    )

    expect(screen.getByRole('heading', { name: 'Página de login' })).toBeVisible()
  })

  it('libera a rota quando existe token', () => {
    authStorage.setToken('jwt-valido')

    render(
      <TestProviders>
        <MemoryRouter initialEntries={['/app']}>
          <Routes>
            <Route path="/login" element={<h1>Página de login</h1>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/app" element={<h1>Área protegida</h1>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </TestProviders>,
    )

    expect(screen.getByRole('heading', { name: 'Área protegida' })).toBeVisible()
  })
})
