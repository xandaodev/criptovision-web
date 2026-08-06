import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { authStorage } from '../features/auth/auth-storage.ts'
import { TestProviders } from '../test/test-utils.tsx'
import { DashboardPage } from './DashboardPage.tsx'

afterEach(() => {
  vi.unstubAllGlobals()
})

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function renderDashboard() {
  render(
    <TestProviders>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </TestProviders>,
  )
}

describe('DashboardPage', () => {
  it('mostra patrimônio, distribuição e saldo fracionário dos ativos', async () => {
    authStorage.setToken('jwt-valido')

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({
          valorTotalCarteira: 1500,
          pnlGeral: 240,
          variacao24hCarteira: 1.82,
          ativos: [
            {
              ticker: 'BTC',
              saldo: 0.001,
              precoAtual: 65000,
              precoMedio: 60000,
              valorTotalUSD: 65,
              porcentagemPNL: 8.33,
              variacao24h: 2.35,
            },
            {
              ticker: 'ETH',
              saldo: 0.5,
              precoAtual: 2870,
              precoMedio: 2400,
              valorTotalUSD: 1435,
              porcentagemPNL: 19.58,
              variacao24h: 1.79,
            },
          ],
        }),
      ),
    )

    renderDashboard()

    expect(
      await screen.findByRole('heading', {
        name: 'Seu patrimônio, em uma única leitura.',
      }),
    ).toBeVisible()
      expect(await screen.findByText(/1\.500,00/)).toBeVisible()
    expect(screen.getByText('0,001')).toBeVisible()
    expect(screen.getByText('Distribuição da carteira')).toBeVisible()
    expect(screen.getByText('+19,05%')).toBeVisible()
  })

  it('orienta o usuário quando a carteira ainda está vazia', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({
          valorTotalCarteira: 0,
          pnlGeral: 0,
          variacao24hCarteira: 0,
          ativos: [],
        }),
      ),
    )

    renderDashboard()

    expect(await screen.findByText('Registre sua primeira compra.')).toBeVisible()
    expect(
      screen.getByRole('link', { name: 'Cadastrar primeira transação' }),
    ).toHaveAttribute('href', '/app/transacoes')
  })
})
