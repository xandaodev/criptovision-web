import { z } from 'zod'
import { TRANSACTION_TYPES } from '../types/transaction.ts'

const positiveDecimal = (fieldLabel: string) =>
  z
    .union([z.string(), z.number()])
    .transform((value) => {
      if (typeof value === 'number') {
        return value
      }

      const normalized = value.trim().replace(',', '.')
      return normalized === '' ? Number.NaN : Number(normalized)
    })
    .refine(Number.isFinite, `${fieldLabel} deve ser um número válido.`)
    .refine((value) => value > 0, `${fieldLabel} deve ser maior que zero.`)

export const transactionSchema = z.object({
  ticker: z
    .string()
    .trim()
    .min(1, 'Informe o ticker do ativo.')
    .max(20, 'O ticker deve possuir no máximo 20 caracteres.')
    .transform((value) => value.toUpperCase())
    .refine(
      (value) => /^[A-Z0-9]+$/.test(value),
      'Use somente letras e números no ticker.',
    ),
  quantidade: positiveDecimal('A quantidade'),
  precoUnitario: positiveDecimal('O preço unitário'),
  tipo: z.enum(TRANSACTION_TYPES),
})

export type TransactionFormInput = z.input<typeof transactionSchema>
export type TransactionFormData = z.output<typeof transactionSchema>
