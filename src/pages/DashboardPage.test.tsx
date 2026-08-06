import { render, screen, within } from '@testing-library/react'
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
  it('mostra patrimônio, distribuição e saldo fracionário com cotações atuais', async () => {
    authStorage.setToken('jwt-valido')

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({
          valorTotalCarteira: 1500,
          pnlGeral: 240,
          variacao24hCarteira: 1.82,
          cotacoesAtualizadasEm: '2026-08-06T14:30:00Z',
          cotacoesParciais: false,
          ativosSemCotacao: [],
          ativos: [
            {
              ticker: 'BTC',
              saldo: 0.001,
              precoAtual: 65000,
              precoMedio: 60000,
              valorTotalUSD: 65,
              porcentagemPNL: 8.33,
              variacao24h: 2.35,
              cotacaoDisponivel: true,
              cotacaoDesatualizada: false,
              cotacaoAtualizadaEm: '2026-08-06T14:30:00Z',
            },
            {
              ticker: 'ETH',
              saldo: 0.5,
              precoAtual: 2870,
              precoMedio: 2400,
              valorTotalUSD: 1435,
              porcentagemPNL: 19.58,
              variacao24h: 1.79,
              cotacaoDisponivel: true,
              cotacaoDesatualizada: false,
              cotacaoAtualizadaEm: '2026-08-06T14:30:00Z',
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
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('orienta o usuário quando a carteira ainda está vazia', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({
          valorTotalCarteira: 0,
          pnlGeral: 0,
          variacao24hCarteira: 0,
          cotacoesAtualizadasEm: null,
          cotacoesParciais: false,
          ativosSemCotacao: [],
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

  it('preserva ativos sem cotação e sinaliza preços anteriores sem inventar valores', async () => {
    const staleQuoteTime = new Date(Date.now() - 10 * 60_000).toISOString()

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({
          valorTotalCarteira: 65,
          pnlGeral: 5,
          variacao24hCarteira: 2.35,
          cotacoesAtualizadasEm: staleQuoteTime,
          cotacoesParciais: true,
          ativosSemCotacao: ['XYZ'],
          ativos: [
            {
              ticker: 'BTC',
              saldo: 0.001,
              precoAtual: 65000,
              precoMedio: 60000,
              valorTotalUSD: 65,
              porcentagemPNL: 8.33,
              variacao24h: 2.35,
              cotacaoDisponivel: true,
              cotacaoDesatualizada: true,
              cotacaoAtualizadaEm: staleQuoteTime,
            },
            {
              ticker: 'XYZ',
              saldo: 12.5,
              precoAtual: null,
              precoMedio: 2,
              valorTotalUSD: null,
              porcentagemPNL: null,
              variacao24h: null,
              cotacaoDisponivel: false,
              cotacaoDesatualizada: false,
              cotacaoAtualizadaEm: null,
            },
          ],
        }),
      ),
    )

    renderDashboard()

      const quoteStatus = await screen.findByRole('status', {
          name: 'Algumas cotações estão temporariamente indisponíveis',
      })
    expect(quoteStatus).toHaveTextContent(
      'Algumas cotações estão temporariamente indisponíveis',
    )
    expect(quoteStatus).toHaveTextContent('Sem cotação: XYZ')
    expect(quoteStatus).toHaveTextContent('Cotação anterior: BTC')
    expect(
      screen.getByRole('button', { name: 'Tentar atualizar cotações' }),
    ).toBeVisible()

    expect(screen.getByText('Cotação indisponível')).toBeVisible()
    expect(screen.getByText('Posição preservada')).toBeVisible()
    expect(screen.getByText(/Cotação anterior — há \d+ minutos/)).toBeVisible()
    expect(screen.getByText('1 de 2 ativos')).toBeVisible()
    expect(
      screen.getAllByText('Somente posições com cotação disponível'),
    ).toHaveLength(4)

    const distributionPanel = screen
      .getByRole('heading', { name: 'Distribuição da carteira' })
      .closest('article')

    expect(distributionPanel).not.toBeNull()
    expect(within(distributionPanel!).getByText('BTC')).toBeVisible()
    expect(within(distributionPanel!).queryByText('XYZ')).not.toBeInTheDocument()
  })
})
