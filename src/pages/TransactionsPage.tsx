import { useMemo, useState } from 'react'
import { ApiErrorAlert } from '../components/ApiErrorAlert.tsx'
import { DeleteTransactionDialog } from '../features/transactions/components/DeleteTransactionDialog.tsx'
import { TransactionEditor } from '../features/transactions/components/TransactionEditor.tsx'
import { TransactionList } from '../features/transactions/components/TransactionList.tsx'
import {
  useCreateTransaction,
  useDeleteTransaction,
  useTransactions,
  useUpdateTransaction,
} from '../features/transactions/hooks/use-transactions.ts'
import type { TransactionFormData } from '../features/transactions/schemas/transaction-schema.ts'
import type {
  Transaction,
  TransactionType,
} from '../features/transactions/types/transaction.ts'
import { getApiErrorMessage } from '../services/api-error.ts'

type EditorState =
  | { mode: 'create' }
  | { mode: 'edit'; transaction: Transaction }
  | null

type Feedback = {
  title: string
  message: string
} | null

const usdFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

export function TransactionsPage() {
  const transactionsQuery = useTransactions()
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()
  const deleteMutation = useDeleteTransaction()

  const [editor, setEditor] = useState<EditorState>(null)
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(
    null,
  )
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'TODAS' | TransactionType>('TODAS')
  const [feedback, setFeedback] = useState<Feedback>(null)

  const transactions = transactionsQuery.data ?? []

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toUpperCase()

    return [...transactions]
      .filter((transaction) => {
        const matchesTicker =
          normalizedSearch === '' || transaction.ticker.includes(normalizedSearch)
        const matchesType =
          typeFilter === 'TODAS' || transaction.tipo === typeFilter
        return matchesTicker && matchesType
      })
      .sort(
        (first, second) =>
          new Date(second.data).getTime() - new Date(first.data).getTime(),
      )
  }, [search, transactions, typeFilter])

  const summary = useMemo(() => {
    return transactions.reduce(
      (current, transaction) => {
        current.volume += transaction.quantidade * transaction.precoUnitario
        if (transaction.tipo === 'COMPRA') {
          current.purchases += 1
        } else {
          current.sales += 1
        }
        return current
      },
      { purchases: 0, sales: 0, volume: 0 },
    )
  }, [transactions])

  function openCreateEditor() {
    createMutation.reset()
    updateMutation.reset()
    setFeedback(null)
    setEditor({ mode: 'create' })
  }

  function openEditEditor(transaction: Transaction) {
    createMutation.reset()
    updateMutation.reset()
    setFeedback(null)
    setEditor({ mode: 'edit', transaction })
  }

  function saveTransaction(data: TransactionFormData) {
    if (editor?.mode === 'edit') {
      updateMutation.mutate(
        { id: editor.transaction.id, input: data },
        {
          onSuccess: () => {
            setEditor(null)
            setFeedback({
              title: 'Transação atualizada',
              message: 'As alterações já foram refletidas no seu histórico.',
            })
          },
        },
      )
      return
    }

    createMutation.mutate(data, {
      onSuccess: () => {
        setEditor(null)
        setFeedback({
          title: 'Transação registrada',
          message: 'A nova operação foi adicionada ao seu histórico.',
        })
      },
    })
  }

  function requestDelete(transaction: Transaction) {
    deleteMutation.reset()
    setFeedback(null)
    setTransactionToDelete(transaction)
  }

  function confirmDelete() {
    if (!transactionToDelete) {
      return
    }

    deleteMutation.mutate(transactionToDelete.id, {
      onSuccess: () => {
        setTransactionToDelete(null)
        setFeedback({
          title: 'Transação excluída',
          message: 'A operação foi removida e o histórico foi recalculado.',
        })
      },
    })
  }

  const activeMutation = editor?.mode === 'edit' ? updateMutation : createMutation

  return (
    <section className="transactions-page">
      <header className="page-heading">
        <div>
          <span className="eyebrow">Controle de operações</span>
          <h1>Suas transações</h1>
          <p>
            Registre compras e vendas para manter a carteira reconstruída a partir do
            histórico real.
          </p>
        </div>
        <button className="button button--primary" type="button" onClick={openCreateEditor}>
          + Nova transação
        </button>
      </header>

      <div className="metric-grid" aria-label="Resumo das transações">
        <article className="metric-card">
          <span>Total de operações</span>
          <strong>{transactions.length}</strong>
          <small>Compras e vendas registradas</small>
        </article>
        <article className="metric-card">
          <span>Compras</span>
          <strong>{summary.purchases}</strong>
          <small>Operações de entrada</small>
        </article>
        <article className="metric-card">
          <span>Vendas</span>
          <strong>{summary.sales}</strong>
          <small>Operações de saída</small>
        </article>
        <article className="metric-card">
          <span>Volume movimentado</span>
          <strong>{usdFormatter.format(summary.volume)}</strong>
          <small>Soma bruta das operações</small>
        </article>
      </div>

      {feedback && (
        <div className="alert alert--success page-feedback" role="status">
          <strong>{feedback.title}</strong>
          <span>{feedback.message}</span>
        </div>
      )}

      <section className="history-panel">
        <header className="history-panel__header">
          <div>
            <h2>Histórico</h2>
            <p>Consulte, edite ou exclua operações pertencentes à sua conta.</p>
          </div>

          <div className="transaction-filters">
            <label className="search-field">
              <span className="sr-only">Buscar por ticker</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar ticker"
              />
            </label>
            <label>
              <span className="sr-only">Filtrar por tipo</span>
              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value as 'TODAS' | TransactionType)
                }
              >
                <option value="TODAS">Todas</option>
                <option value="COMPRA">Compras</option>
                <option value="VENDA">Vendas</option>
              </select>
            </label>
          </div>
        </header>

        {transactionsQuery.isPending && (
          <div className="loading-state" role="status">
            <span className="loading-spinner" />
            <strong>Carregando seu histórico...</strong>
          </div>
        )}

        {transactionsQuery.isError && (
          <div className="panel-message">
            <ApiErrorAlert message={getApiErrorMessage(transactionsQuery.error)} />
            <button
              className="button button--ghost"
              type="button"
              onClick={() => transactionsQuery.refetch()}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {transactionsQuery.isSuccess && transactions.length === 0 && (
          <div className="empty-state">
            <span className="empty-state__icon">↗</span>
            <h3>Nenhuma transação registrada</h3>
            <p>Adicione sua primeira compra para começar a construir a carteira.</p>
            <button className="button button--primary" type="button" onClick={openCreateEditor}>
              Registrar primeira transação
            </button>
          </div>
        )}

        {transactionsQuery.isSuccess &&
          transactions.length > 0 &&
          filteredTransactions.length === 0 && (
            <div className="empty-state empty-state--compact">
              <h3>Nenhum resultado encontrado</h3>
              <p>Altere o ticker pesquisado ou o filtro de operação.</p>
            </div>
          )}

        {transactionsQuery.isSuccess && filteredTransactions.length > 0 && (
          <TransactionList
            transactions={filteredTransactions}
            onEdit={openEditEditor}
            onDelete={requestDelete}
          />
        )}
      </section>

      {editor && (
        <TransactionEditor
          key={editor.mode === 'edit' ? editor.transaction.id : 'new-transaction'}
          transaction={editor.mode === 'edit' ? editor.transaction : undefined}
          isPending={activeMutation.isPending}
          error={activeMutation.error}
          onClose={() => setEditor(null)}
          onSave={saveTransaction}
        />
      )}

      {transactionToDelete && (
        <DeleteTransactionDialog
          transaction={transactionToDelete}
          isPending={deleteMutation.isPending}
          error={deleteMutation.error}
          onCancel={() => setTransactionToDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </section>
  )
}
