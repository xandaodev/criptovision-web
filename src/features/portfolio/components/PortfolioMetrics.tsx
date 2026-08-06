import type { PortfolioSummary } from '../types/portfolio.ts'
import {
  formatPercentage,
  formatUsdTotal,
  getPerformanceClass,
} from '../utils/portfolio-formatters.ts'

type PortfolioMetricsProps = {
  summary: PortfolioSummary
}

export function PortfolioMetrics({ summary }: PortfolioMetricsProps) {
  const investedCost = summary.valorTotalCarteira - summary.pnlGeral
  const totalReturn = investedCost > 0 ? (summary.pnlGeral / investedCost) * 100 : 0

  return (
    <div className="portfolio-metrics" aria-label="Indicadores da carteira">
      <article className="portfolio-metric portfolio-metric--featured">
        <span>Patrimônio atual</span>
        <strong>{formatUsdTotal(summary.valorTotalCarteira)}</strong>
        <small>Valor de mercado consolidado</small>
      </article>

      <article className="portfolio-metric">
        <span>PNL não realizado</span>
        <strong className={getPerformanceClass(summary.pnlGeral)}>
          {formatUsdTotal(summary.pnlGeral)}
        </strong>
        <small>Resultado das posições abertas</small>
      </article>

      <article className="portfolio-metric">
        <span>Rentabilidade</span>
        <strong className={getPerformanceClass(totalReturn)}>
          {formatPercentage(totalReturn, true)}
        </strong>
        <small>Em relação ao custo das posições</small>
      </article>

      <article className="portfolio-metric">
        <span>Variação estimada em 24h</span>
        <strong className={getPerformanceClass(summary.variacao24hCarteira)}>
          {formatPercentage(summary.variacao24hCarteira, true)}
        </strong>
        <small>Movimento ponderado da carteira</small>
      </article>
    </div>
  )
}
