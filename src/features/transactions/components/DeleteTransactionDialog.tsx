import { ApiErrorAlert } from '../../../components/ApiErrorAlert.tsx'
import { getApiErrorMessage } from '../../../services/api-error.ts'
import type { Transaction } from '../types/transaction.ts'

type DeleteTransactionDialogProps = {
  transaction: Transaction
  isPending: boolean
  error: unknown
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteTransactionDialog({
  transaction,
  isPending,
  error,
  onCancel,
  onConfirm,
}: DeleteTransactionDialogProps) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="modal-card modal-card--compact"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-transaction-title"
        aria-describedby="delete-transaction-description"
      >
        <header className="modal-header">
          <div>
            <span className="eyebrow eyebrow--danger">Ação permanente</span>
            <h2 id="delete-transaction-title">Excluir transação?</h2>
          </div>
        </header>

        <p id="delete-transaction-description" className="delete-description">
          A operação de <strong>{transaction.tipo.toLowerCase()}</strong> de{' '}
          <strong>{transaction.ticker}</strong> será removida. A API impedirá a exclusão
          caso ela torne o histórico financeiro inconsistente.
        </p>

        {error !== null && error !== undefined && (
          <ApiErrorAlert message={getApiErrorMessage(error)} />
        )}

        <div className="modal-actions">
          <button
            className="button button--ghost"
            type="button"
            onClick={onCancel}
            disabled={isPending}
          >
            Manter transação
          </button>
          <button
            className="button button--danger"
            type="button"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? 'Excluindo...' : 'Excluir definitivamente'}
          </button>
        </div>
      </section>
    </div>
  )
}
