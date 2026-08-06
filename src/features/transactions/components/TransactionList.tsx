import type { Transaction } from '../types/transaction.ts'

const usdFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const quantityFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 18,
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date)
}

type TransactionListProps = {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  return (
    <div className="transaction-list" aria-label="Histórico de transações">
      <div className="transaction-list__header" aria-hidden="true">
        <span>Ativo</span>
        <span>Operação</span>
        <span>Quantidade</span>
        <span>Preço unitário</span>
        <span>Data</span>
        <span>Ações</span>
      </div>

      {transactions.map((transaction) => (
        <article className="transaction-row" key={transaction.id}>
          <div className="transaction-asset">
            <span className="asset-avatar">{transaction.ticker.slice(0, 2)}</span>
            <div>
              <strong>{transaction.ticker}</strong>
              <small>#{transaction.id}</small>
            </div>
          </div>

          <div>
            <span
              className={`transaction-badge transaction-badge--${transaction.tipo.toLowerCase()}`}
            >
              {transaction.tipo === 'COMPRA' ? 'Compra' : 'Venda'}
            </span>
          </div>

          <div className="transaction-cell" data-label="Quantidade">
            <strong>{quantityFormatter.format(transaction.quantidade)}</strong>
            <small>{transaction.ticker}</small>
          </div>

          <div className="transaction-cell" data-label="Preço unitário">
            <strong>{usdFormatter.format(transaction.precoUnitario)}</strong>
            <small>
              Volume:{' '}
              {usdFormatter.format(transaction.quantidade * transaction.precoUnitario)}
            </small>
          </div>

          <div className="transaction-cell" data-label="Data">
            <strong>{formatDate(transaction.data)}</strong>
            <small>Horário da operação</small>
          </div>

          <div className="transaction-actions">
            <button
              className="table-action"
              type="button"
              onClick={() => onEdit(transaction)}
              aria-label={`Editar transação de ${transaction.ticker}`}
            >
              Editar
            </button>
            <button
              className="table-action table-action--danger"
              type="button"
              onClick={() => onDelete(transaction)}
              aria-label={`Excluir transação de ${transaction.ticker}`}
            >
              Excluir
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
