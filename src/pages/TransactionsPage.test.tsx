import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { authStorage } from '../features/auth/auth-storage.ts'
import { TestProviders } from '../test/test-utils.tsx'
import { TransactionsPage } from './TransactionsPage.tsx'

const initialTransactions = [
  {
    id: 1,
    ticker: 'BTC',
    quantidade: 0.01,
    precoUnitario: 60000,
    data: '2026-08-05T17:30:00',
    tipo: 'COMPRA',
  },
  {
    id: 2,
    ticker: 'ETH',
    quantidade: 0.2,
    precoUnitario: 3500,
    data: '2026-08-05T18:00:00',
    tipo: 'VENDA',
  },
] as const

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': status >= 400 ? 'application/problem+json' : 'application/json',
    },
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('TransactionsPage', () => {
  it('lista as operações do usuário autenticado', async () => {
    authStorage.setToken('jwt-valido')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(initialTransactions)))

    render(
      <TestProviders>
        <TransactionsPage />
      </TestProviders>,
    )

    expect(
      await screen.findByRole('button', { name: 'Editar transação de BTC' }),
    ).toBeVisible()
    expect(screen.getByRole('button', { name: 'Editar transação de ETH' })).toBeVisible()
    expect(screen.getByText('2', { selector: '.metric-card strong' })).toBeVisible()
  })

  it('exibe corretamente quantidades fracionárias de criptomoedas', async () => {
    authStorage.setToken('jwt-valido')

    const fractionalTransaction = [
      {
        id: 8,
        ticker: 'BTC',
        quantidade: 0.001,
        precoUnitario: 64000,
        data: '2026-08-05T20:00:00',
        tipo: 'COMPRA',
      },
    ]

    vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(jsonResponse(fractionalTransaction)),
    )

    render(
        <TestProviders>
          <TransactionsPage />
        </TestProviders>,
    )

    expect(
        await screen.findByText('0,001', {
          selector: '.transaction-cell strong',
        }),
    ).toBeVisible()
  })


  it('cadastra uma nova transação e atualiza o histórico', async () => {
    authStorage.setToken('jwt-valido')
    const createdTransaction = {
      id: 3,
      ticker: 'SOL',
      quantidade: 2,
      precoUnitario: 150,
      data: '2026-08-05T19:00:00',
      tipo: 'COMPRA',
    }

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(initialTransactions))
      .mockResolvedValueOnce(jsonResponse(createdTransaction, 201))
      .mockResolvedValueOnce(
        jsonResponse([...initialTransactions, createdTransaction]),
      )
    vi.stubGlobal('fetch', fetchMock)

    const user = userEvent.setup()
    render(
      <TestProviders>
        <TransactionsPage />
      </TestProviders>,
    )

    await screen.findByRole('button', { name: 'Editar transação de BTC' })
    await user.click(screen.getByRole('button', { name: '+ Nova transação' }))

    const dialog = screen.getByRole('dialog', { name: 'Nova transação' })
    await user.type(within(dialog).getByLabelText('Ticker'), 'sol')
    await user.type(within(dialog).getByLabelText('Quantidade'), '2')
    await user.type(within(dialog).getByLabelText('Preço unitário (USD)'), '150')
    await user.click(within(dialog).getByRole('button', { name: 'Registrar transação' }))

    expect(await screen.findByText('Transação registrada')).toBeVisible()
    expect(
      await screen.findByRole('button', { name: 'Editar transação de SOL' }),
    ).toBeVisible()

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3))
    const [url, options] = fetchMock.mock.calls[1] as [string, RequestInit]
    expect(url).toBe('http://localhost:8080/transacoes')
    expect(options.method).toBe('POST')
    expect(options.body).toBe(
      JSON.stringify({
        ticker: 'SOL',
        quantidade: 2,
        precoUnitario: 150,
        tipo: 'COMPRA',
      }),
    )
  })

  it('edita uma transação existente', async () => {
    authStorage.setToken('jwt-valido')
    const updatedTransaction = {
      ...initialTransactions[0],
      quantidade: 0.02,
      precoUnitario: 62000,
    }

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(initialTransactions))
      .mockResolvedValueOnce(jsonResponse(updatedTransaction))
      .mockResolvedValueOnce(
        jsonResponse([updatedTransaction, initialTransactions[1]]),
      )
    vi.stubGlobal('fetch', fetchMock)

    const user = userEvent.setup()
    render(
      <TestProviders>
        <TransactionsPage />
      </TestProviders>,
    )

    await user.click(
      await screen.findByRole('button', { name: 'Editar transação de BTC' }),
    )

    const dialog = screen.getByRole('dialog', { name: 'Editar transação' })
    const quantityInput = within(dialog).getByLabelText('Quantidade')
    const priceInput = within(dialog).getByLabelText('Preço unitário (USD)')

    await user.clear(quantityInput)
    await user.type(quantityInput, '0.02')
    await user.clear(priceInput)
    await user.type(priceInput, '62000')
    await user.click(within(dialog).getByRole('button', { name: 'Salvar alterações' }))

    expect(await screen.findByText('Transação atualizada')).toBeVisible()

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3))
    const [url, options] = fetchMock.mock.calls[1] as [string, RequestInit]
    expect(url).toBe('http://localhost:8080/transacoes/1')
    expect(options.method).toBe('PUT')
  })

  it('mantém o diálogo aberto quando a API rejeita uma exclusão inconsistente', async () => {
    authStorage.setToken('jwt-valido')
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(initialTransactions))
      .mockResolvedValueOnce(
        jsonResponse(
          {
            title: 'Histórico inconsistente',
            status: 409,
            detail: 'A exclusão deixaria uma venda posterior sem saldo suficiente.',
          },
          409,
        ),
      )
    vi.stubGlobal('fetch', fetchMock)

    const user = userEvent.setup()
    render(
      <TestProviders>
        <TransactionsPage />
      </TestProviders>,
    )

    await user.click(
      await screen.findByRole('button', { name: 'Excluir transação de BTC' }),
    )
    const dialog = screen.getByRole('alertdialog', { name: 'Excluir transação?' })
    await user.click(
      within(dialog).getByRole('button', { name: 'Excluir definitivamente' }),
    )

    expect(
      await within(dialog).findByText(
        'A exclusão deixaria uma venda posterior sem saldo suficiente.',
      ),
    ).toBeVisible()
    expect(dialog).toBeVisible()
  })
})
