import type { PortfolioAsset } from '../types/portfolio.ts'
import {
  formatPercentage,
  formatQuantity,
  formatUsdPrice,
  formatUsdTotal,
  getPerformanceClass,
} from '../utils/portfolio-formatters.ts'

type PortfolioAssetTableProps = {
  assets: PortfolioAsset[]
  totalValue: number
}

export function PortfolioAssetTable({ assets, totalValue }: PortfolioAssetTableProps) {
  const orderedAssets = [...assets].sort(
    (first, second) => second.valorTotalUSD - first.valorTotalUSD,
  )

  return (
    <article className="portfolio-panel portfolio-assets">
      <header className="portfolio-panel__header">
        <div>
          <span className="panel-kicker">Posições abertas</span>
          <h2>Ativos da carteira</h2>
        </div>
        <span className="portfolio-currency-note">Valores em USD</span>
      </header>

      <div className="portfolio-table-scroll">
        <table className="portfolio-table">
          <thead>
            <tr>
              <th>Ativo</th>
              <th>Saldo</th>
              <th>Preço médio</th>
              <th>Preço atual</th>
              <th>Valor atual</th>
              <th>PNL</th>
              <th>24h</th>
              <th>Participação</th>
            </tr>
          </thead>
          <tbody>
            {orderedAssets.map((asset) => {
              const absolutePnl = asset.saldo * (asset.precoAtual - asset.precoMedio)
              const participation =
                totalValue > 0 ? (asset.valorTotalUSD / totalValue) * 100 : 0

              return (
                <tr key={asset.ticker}>
                  <td>
                    <div className="portfolio-asset-identity">
                      <span className="portfolio-asset-mark">
                        {asset.ticker.slice(0, 2)}
                      </span>
                      <strong>{asset.ticker}</strong>
                    </div>
                  </td>
                  <td>
                    <strong>{formatQuantity(asset.saldo)}</strong>
                    <small>{asset.ticker}</small>
                  </td>
                  <td>{formatUsdPrice(asset.precoMedio)}</td>
                  <td>{formatUsdPrice(asset.precoAtual)}</td>
                  <td>
                    <strong>{formatUsdTotal(asset.valorTotalUSD)}</strong>
                  </td>
                  <td>
                    <strong className={getPerformanceClass(absolutePnl)}>
                      {formatUsdTotal(absolutePnl)}
                    </strong>
                    <small className={getPerformanceClass(asset.porcentagemPNL)}>
                      {formatPercentage(asset.porcentagemPNL, true)}
                    </small>
                  </td>
                  <td>
                    <span className={getPerformanceClass(asset.variacao24h)}>
                      {formatPercentage(asset.variacao24h, true)}
                    </span>
                  </td>
                  <td>
                    <div className="participation-cell">
                      <span>{formatPercentage(participation)}</span>
                      <span className="participation-track" aria-hidden="true">
                        <span style={{ width: `${Math.min(participation, 100)}%` }} />
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </article>
  )
}
