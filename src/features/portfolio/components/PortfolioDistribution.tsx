import type { CSSProperties } from 'react'
import type { PortfolioAsset } from '../types/portfolio.ts'
import { formatPercentage, formatUsdTotal } from '../utils/portfolio-formatters.ts'

type PortfolioDistributionProps = {
  assets: PortfolioAsset[]
  totalValue: number
}

const chartColors = [
  '#45d6a0',
  '#6f8cff',
  '#f5b95f',
  '#c978ff',
  '#55c8e8',
  '#ff7c8a',
  '#a3d65c',
  '#ef8dd0',
]

export function PortfolioDistribution({
  assets,
  totalValue,
}: PortfolioDistributionProps) {
  const orderedAssets = [...assets].sort(
    (first, second) => second.valorTotalUSD - first.valorTotalUSD,
  )

  let accumulatedPercentage = 0
  const gradientStops = orderedAssets.map((asset, index) => {
    const participation = totalValue > 0 ? (asset.valorTotalUSD / totalValue) * 100 : 0
    const start = accumulatedPercentage
    const end = accumulatedPercentage + participation
    accumulatedPercentage = end
    return `${chartColors[index % chartColors.length]} ${start}% ${end}%`
  })

  const chartStyle: CSSProperties = {
    background: `conic-gradient(${gradientStops.join(', ')})`,
  }

  return (
    <article className="portfolio-panel portfolio-distribution">
      <header className="portfolio-panel__header">
        <div>
          <span className="panel-kicker">Composição</span>
          <h2>Distribuição da carteira</h2>
        </div>
        <span className="asset-count">{assets.length} ativos</span>
      </header>

      <div className="distribution-content">
        <div
          className="distribution-chart"
          style={chartStyle}
          role="img"
          aria-label="Gráfico de distribuição dos ativos da carteira"
        >
          <div className="distribution-chart__center">
            <strong>{assets.length}</strong>
            <span>ativos</span>
          </div>
        </div>

        <div className="distribution-legend">
          {orderedAssets.map((asset, index) => {
            const participation =
              totalValue > 0 ? (asset.valorTotalUSD / totalValue) * 100 : 0

            return (
              <div className="distribution-legend__item" key={asset.ticker}>
                <span
                  className="distribution-legend__color"
                  style={{ backgroundColor: chartColors[index % chartColors.length] }}
                />
                <div>
                  <strong>{asset.ticker}</strong>
                  <small>{formatUsdTotal(asset.valorTotalUSD)}</small>
                </div>
                <span>{formatPercentage(participation)}</span>
              </div>
            )
          })}
        </div>
      </div>
    </article>
  )
}
