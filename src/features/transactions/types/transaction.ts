export const TRANSACTION_TYPES = ['COMPRA', 'VENDA'] as const

export type TransactionType = (typeof TRANSACTION_TYPES)[number]

export type Transaction = {
  id: number
  ticker: string
  quantidade: number
  precoUnitario: number
  data: string
  tipo: TransactionType
}

export type TransactionInput = {
  ticker: string
  quantidade: number
  precoUnitario: number
  tipo: TransactionType
}
