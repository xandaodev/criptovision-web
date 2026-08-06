import type { TransactionFormData } from '../schemas/transaction-schema.ts'
import type { Transaction } from '../types/transaction.ts'
import { TransactionForm } from './TransactionForm.tsx'

type TransactionEditorProps = {
  transaction?: Transaction
  isPending: boolean
  error: unknown
  onClose: () => void
  onSave: (data: TransactionFormData) => void
}

export function TransactionEditor({
  transaction,
  isPending,
  error,
  onClose,
  onSave,
}: TransactionEditorProps) {
  const title = transaction ? 'Editar transação' : 'Nova transação'

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-editor-title"
      >
        <header className="modal-header">
          <div>
            <span className="eyebrow">Histórico financeiro</span>
            <h2 id="transaction-editor-title">{title}</h2>
            <p>
              {transaction
                ? 'Atualize os dados sem comprometer a consistência do histórico.'
                : 'Registre uma compra ou venda realizada em sua carteira.'}
            </p>
          </div>
          <button
            className="icon-button"
            type="button"
            aria-label="Fechar formulário"
            onClick={onClose}
            disabled={isPending}
          >
            ×
          </button>
        </header>

        <TransactionForm
          transaction={transaction}
          isPending={isPending}
          error={error}
          onCancel={onClose}
          onSave={onSave}
        />
      </section>
    </div>
  )
}
