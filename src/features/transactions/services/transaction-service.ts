import { apiRequest } from '../../../services/api-client.ts'
import type { Transaction, TransactionInput } from '../types/transaction.ts'

export const transactionService = {
  list(): Promise<Transaction[]> {
    return apiRequest<Transaction[]>('/transacoes')
  },

  create(input: TransactionInput): Promise<Transaction> {
    return apiRequest<Transaction>('/transacoes', {
      method: 'POST',
      body: input,
    })
  },

  update(id: number, input: TransactionInput): Promise<Transaction> {
    return apiRequest<Transaction>(`/transacoes/${id}`, {
      method: 'PUT',
      body: input,
    })
  },

  remove(id: number): Promise<void> {
    return apiRequest<void>(`/transacoes/${id}`, {
      method: 'DELETE',
    })
  },
}
