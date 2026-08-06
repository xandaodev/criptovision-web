import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { authStorage } from '../features/auth/auth-storage.ts'
import { TestProviders } from '../test/test-utils.tsx'
import { LoginPage } from './LoginPage.tsx'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('LoginPage', () => {
  it('autentica, salva o token e abre o dashboard', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ token: 'jwt-gerado' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const user = userEvent.setup()
    render(
      <TestProviders>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/app/dashboard" element={<h1>Dashboard</h1>} />
          </Routes>
        </MemoryRouter>
      </TestProviders>,
    )

    await user.type(screen.getByLabelText('Login'), 'alexandre')
    await user.type(screen.getByLabelText('Senha'), 'senha-segura')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeVisible()
    expect(authStorage.getToken()).toBe('jwt-gerado')

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(options.body).toBe(
      JSON.stringify({ login: 'alexandre', senha: 'senha-segura' }),
    )
  })

  it('mostra o detalhe padronizado quando o login falha', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            title: 'Não autorizado',
            status: 401,
            detail: 'Login ou senha inválidos.',
          }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/problem+json' },
          },
        ),
      ),
    )

    const user = userEvent.setup()
    render(
      <TestProviders>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </TestProviders>,
    )

    await user.type(screen.getByLabelText('Login'), 'alexandre')
    await user.type(screen.getByLabelText('Senha'), 'senha-incorreta')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText('Login ou senha inválidos.')).toBeVisible()
  })
})
