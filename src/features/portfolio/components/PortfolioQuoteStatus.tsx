import type { PortfolioSummary } from '../types/portfolio.ts'
import { hasAvailableQuote, uniqueTickers } from '../utils/portfolio-quotes.ts'

type PortfolioQuoteStatusProps = {
  summary: PortfolioSummary
  isRefreshing: boolean
  onRefresh: () => void
}

export function PortfolioQuoteStatus({
  summary,
  isRefreshing,
  onRefresh,
}: PortfolioQuoteStatusProps) {
  const unavailableTickers = uniqueTickers([
    ...summary.ativosSemCotacao,
    ...summary.ativos
      .filter((asset) => !hasAvailableQuote(asset))
      .map((asset) => asset.ticker),
  ])
  const staleTickers = uniqueTickers(
    summary.ativos
      .filter((asset) => hasAvailableQuote(asset) && asset.cotacaoDesatualizada)
      .map((asset) => asset.ticker),
  )

  const hasUnavailableQuotes = unavailableTickers.length > 0
  const hasStaleQuotes = staleTickers.length > 0

  if (!summary.cotacoesParciais && !hasUnavailableQuotes && !hasStaleQuotes) {
    return null
  }

  const title = hasUnavailableQuotes
    ? 'Algumas cotações estão temporariamente indisponíveis'
    : 'Alguns preços vieram da última cotação disponível'

  return (
      <article
          className="portfolio-quote-status"
          role="status"
          aria-live="polite"
          aria-label={title}
      >
      <div className="portfolio-quote-status__icon" aria-hidden="true">
        !
      </div>

      <div className="portfolio-quote-status__content">
        <strong>{title}</strong>

        {hasUnavailableQuotes && (
          <p>
            Sem cotação: <b>{unavailableTickers.join(', ')}</b>. Essas posições
            permanecem na carteira, mas não entram no patrimônio, no PNL ou na
            distribuição.
          </p>
        )}

        {hasStaleQuotes && (
          <p>
            Cotação anterior: <b>{staleTickers.join(', ')}</b>. O dashboard mostra o
            último preço utilizável enquanto tenta recuperar dados atuais.
          </p>
        )}
      </div>

      <button
        className="button button--ghost portfolio-quote-status__action"
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        {isRefreshing ? 'Atualizando...' : 'Tentar atualizar cotações'}
      </button>
    </article>
  )
}
