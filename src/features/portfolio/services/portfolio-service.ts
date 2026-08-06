import { apiRequest } from '../../../services/api-client.ts'
import type { PortfolioSummary } from '../types/portfolio.ts'

export const portfolioService = {
  getSummary(): Promise<PortfolioSummary> {
    return apiRequest<PortfolioSummary>('/carteira/resumo')
  },
}
