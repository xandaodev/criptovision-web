import { useQuery } from '@tanstack/react-query'
import { portfolioService } from '../services/portfolio-service.ts'

export const portfolioKeys = {
  all: ['portfolio'] as const,
  summary: () => [...portfolioKeys.all, 'summary'] as const,
}

export function usePortfolioSummary() {
  return useQuery({
    queryKey: portfolioKeys.summary(),
    queryFn: portfolioService.getSummary,
  })
}
