import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ApiErrorAlert } from '../../../components/ApiErrorAlert.tsx'
import { ApiError, getApiErrorMessage } from '../../../services/api-error.ts'
import {
  transactionSchema,
  type TransactionFormData,
  type TransactionFormInput,
} from '../schemas/transaction-schema.ts'
import type { Transaction } from '../types/transaction.ts'

type TransactionFormProps = {
  transaction?: Transaction
  isPending: boolean
  error: unknown
  onCancel: () => void
  onSave: (data: TransactionFormData) => void
}

export function TransactionForm({
  transaction,
  isPending,
  error,
  onCancel,
  onSave,
}: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TransactionFormInput, unknown, TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction
      ? {
          ticker: transaction.ticker,
          quantidade: transaction.quantidade,
          precoUnitario: transaction.precoUnitario,
          tipo: transaction.tipo,
        }
      : {
          ticker: '',
          quantidade: '',
          precoUnitario: '',
          tipo: 'COMPRA',
        },
  })

  useEffect(() => {
    if (!(error instanceof ApiError)) {
      return
    }

    for (const fieldError of error.problem?.erros ?? []) {
      if (
        fieldError.campo === 'ticker' ||
        fieldError.campo === 'quantidade' ||
        fieldError.campo === 'precoUnitario' ||
        fieldError.campo === 'tipo'
      ) {
        setError(fieldError.campo, { message: fieldError.mensagem })
      }
    }
  }, [error, setError])

  return (
    <form className="transaction-form" onSubmit={handleSubmit(onSave)} noValidate>
      {error !== null && error !== undefined && (
        <ApiErrorAlert message={getApiErrorMessage(error)} />
      )}

      <div className="transaction-form__grid">
        <label className="field">
          <span>Ticker</span>
          <input
            type="text"
            autoComplete="off"
            placeholder="BTC"
            maxLength={20}
            aria-invalid={Boolean(errors.ticker)}
            {...register('ticker')}
          />
          {errors.ticker && (
            <small className="field__error">{errors.ticker.message}</small>
          )}
        </label>

        <label className="field">
          <span>Tipo de operação</span>
          <select aria-invalid={Boolean(errors.tipo)} {...register('tipo')}>
            <option value="COMPRA">Compra</option>
            <option value="VENDA">Venda</option>
          </select>
          {errors.tipo && (
            <small className="field__error">{errors.tipo.message}</small>
          )}
        </label>

        <label className="field">
          <span>Quantidade</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            placeholder="0,015"
            aria-invalid={Boolean(errors.quantidade)}
            {...register('quantidade')}
          />
          {errors.quantidade && (
            <small className="field__error">{errors.quantidade.message}</small>
          )}
        </label>

        <label className="field">
          <span>Preço unitário (USD)</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            placeholder="64000,00"
            aria-invalid={Boolean(errors.precoUnitario)}
            {...register('precoUnitario')}
          />
          {errors.precoUnitario && (
            <small className="field__error">{errors.precoUnitario.message}</small>
          )}
        </label>
      </div>

      {transaction && (
        <p className="transaction-form__hint">
          A data original da operação será preservada após a edição.
        </p>
      )}

      <div className="modal-actions">
        <button
          className="button button--ghost"
          type="button"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancelar
        </button>
        <button className="button button--primary" type="submit" disabled={isPending}>
          {isPending
            ? 'Salvando...'
            : transaction
              ? 'Salvar alterações'
              : 'Registrar transação'}
        </button>
      </div>
    </form>
  )
}
