import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { transactionService } from '../services/transaction-service.ts'
import type { TransactionInput } from '../types/transaction.ts'

export const transactionKeys = {
  all: ['transactions'] as const,
}

export function useTransactions() {
  return useQuery({
    queryKey: transactionKeys.all,
    queryFn: transactionService.list,
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: transactionService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: transactionKeys.all })
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: TransactionInput }) =>
      transactionService.update(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: transactionKeys.all })
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: transactionService.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: transactionKeys.all })
    },
  })
}
