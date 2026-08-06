import type { PortfolioAsset } from '../types/portfolio.ts'
import {
  formatPercentage,
  formatQuantity,
  formatQuoteAge,
  formatUsdPrice,
  formatUsdTotal,
  getPerformanceClass,
} from '../utils/portfolio-formatters.ts'
import { hasAvailableQuote } from '../utils/portfolio-quotes.ts'

type PortfolioAssetTableProps = {
  assets: PortfolioAsset[]
  totalValue: number
}

export function PortfolioAssetTable({ assets, totalValue }: PortfolioAssetTableProps) {
  const orderedAssets = [...assets].sort((first, second) => {
    const firstHasQuote = hasAvailableQuote(first)
    const secondHasQuote = hasAvailableQuote(second)

    if (firstHasQuote && secondHasQuote) {
      return second.valorTotalUSD - first.valorTotalUSD
    }

    if (firstHasQuote !== secondHasQuote) {
      return firstHasQuote ? -1 : 1
    }

    return first.ticker.localeCompare(second.ticker)
  })

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
              const quoteAvailable = hasAvailableQuote(asset)
              const absolutePnl = quoteAvailable
                ? asset.saldo * (asset.precoAtual - asset.precoMedio)
                : null
              const participation =
                quoteAvailable && totalValue > 0
                  ? (asset.valorTotalUSD / totalValue) * 100
                  : null

              return (
                <tr
                  className={
                    quoteAvailable ? undefined : 'portfolio-table__row--unavailable'
                  }
                  key={asset.ticker}
                >
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
                  <td>
                    {quoteAvailable ? (
                      <>
                        <strong>{formatUsdPrice(asset.precoAtual)}</strong>
                        {asset.cotacaoDesatualizada && (
                          <small className="portfolio-quote-note portfolio-quote-note--stale">
                            Cotação anterior — {formatQuoteAge(asset.cotacaoAtualizadaEm)}
                          </small>
                        )}
                      </>
                    ) : (
                      <>
                        <strong className="portfolio-quote-unavailable">
                          Cotação indisponível
                        </strong>
                        <small>Posição preservada</small>
                      </>
                    )}
                  </td>
                  <td>
                    <strong>
                      {quoteAvailable ? formatUsdTotal(asset.valorTotalUSD) : '—'}
                    </strong>
                  </td>
                  <td>
                    {absolutePnl === null || !quoteAvailable ? (
                      <>
                        <strong className="performance performance--neutral">—</strong>
                        <small>Sem cotação</small>
                      </>
                    ) : (
                      <>
                        <strong className={getPerformanceClass(absolutePnl)}>
                          {formatUsdTotal(absolutePnl)}
                        </strong>
                        <small className={getPerformanceClass(asset.porcentagemPNL)}>
                          {formatPercentage(asset.porcentagemPNL, true)}
                        </small>
                      </>
                    )}
                  </td>
                  <td>
                    {quoteAvailable ? (
                      <span className={getPerformanceClass(asset.variacao24h)}>
                        {formatPercentage(asset.variacao24h, true)}
                      </span>
                    ) : (
                      <span className="performance performance--neutral">—</span>
                    )}
                  </td>
                  <td>
                    {participation === null ? (
                      <span className="performance performance--neutral">—</span>
                    ) : (
                      <div className="participation-cell">
                        <span>{formatPercentage(participation)}</span>
                        <span className="participation-track" aria-hidden="true">
                          <span style={{ width: `${Math.min(participation, 100)}%` }} />
                        </span>
                      </div>
                    )}
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
