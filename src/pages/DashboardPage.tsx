import { Link } from 'react-router'
import { ApiErrorAlert } from '../components/ApiErrorAlert.tsx'
import { PortfolioAssetTable } from '../features/portfolio/components/PortfolioAssetTable.tsx'
import { PortfolioDistribution } from '../features/portfolio/components/PortfolioDistribution.tsx'
import { PortfolioMetrics } from '../features/portfolio/components/PortfolioMetrics.tsx'
import { PortfolioQuoteStatus } from '../features/portfolio/components/PortfolioQuoteStatus.tsx'
import { PortfolioSkeleton } from '../features/portfolio/components/PortfolioSkeleton.tsx'
import { usePortfolioSummary } from '../features/portfolio/hooks/use-portfolio-summary.ts'
import { formatQuoteDateTime } from '../features/portfolio/utils/portfolio-formatters.ts'
import { hasAvailableQuote } from '../features/portfolio/utils/portfolio-quotes.ts'
import { getApiErrorMessage } from '../services/api-error.ts'
import '../features/portfolio/portfolio.css'

export function DashboardPage() {
  const portfolioQuery = usePortfolioSummary()
  const summary = portfolioQuery.data
  const hasAssets = Boolean(summary?.ativos.length)
  const quotedAssets = summary?.ativos.filter(hasAvailableQuote) ?? []
  const largestPosition = [...quotedAssets].sort(
    (first, second) => second.valorTotalUSD - first.valorTotalUSD,
  )[0]
  const positiveAssets = quotedAssets.filter((asset) => asset.porcentagemPNL > 0).length

  return (
    <section className="portfolio-page">
      <header className="portfolio-heading">
        <div>
          <span className="eyebrow">Visão da carteira</span>
          <h1>Seu patrimônio, em uma única leitura.</h1>
          <p>
            Acompanhe posições, preços médios, resultado não realizado e exposição de
            cada ativo.
          </p>
        </div>

        <div className="portfolio-heading__actions">
          <Link className="button button--ghost" to="/app/transacoes">
            Ver transações
          </Link>
          <button
            className="button button--primary"
            type="button"
            onClick={() => portfolioQuery.refetch()}
            disabled={portfolioQuery.isFetching}
          >
            {portfolioQuery.isFetching ? 'Atualizando...' : 'Atualizar dados'}
          </button>
        </div>
      </header>

      {portfolioQuery.isPending && <PortfolioSkeleton />}

      {portfolioQuery.isError && (
        <div className="portfolio-error-state">
          <ApiErrorAlert message={getApiErrorMessage(portfolioQuery.error)} />
          <button
            className="button button--ghost"
            type="button"
            onClick={() => portfolioQuery.refetch()}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {portfolioQuery.isSuccess && summary && !hasAssets && (
        <article className="portfolio-empty-state">
          <span className="portfolio-empty-state__mark">CV</span>
          <span className="eyebrow">Carteira vazia</span>
          <h2>Registre sua primeira compra.</h2>
          <p>
            O dashboard será calculado automaticamente a partir do seu histórico de
            compras e vendas.
          </p>
          <Link className="button button--primary" to="/app/transacoes">
            Cadastrar primeira transação
          </Link>
        </article>
      )}

      {portfolioQuery.isSuccess && summary && hasAssets && (
        <>
          <div className="portfolio-update-row">
            <span>
              {summary.cotacoesAtualizadasEm
                ? `Cotações atualizadas em ${formatQuoteDateTime(summary.cotacoesAtualizadasEm)}`
                : 'Horário das cotações indisponível'}
            </span>
            <span>Cotações e valores apresentados em USD</span>
          </div>

          <PortfolioQuoteStatus
            summary={summary}
            isRefreshing={portfolioQuery.isFetching}
            onRefresh={() => portfolioQuery.refetch()}
          />

          <PortfolioMetrics summary={summary} />

          <div className="portfolio-overview-grid">
            <PortfolioDistribution
              assets={summary.ativos}
              totalValue={summary.valorTotalCarteira}
            />

            <article className="portfolio-panel portfolio-insight">
              <header className="portfolio-panel__header">
                <div>
                  <span className="panel-kicker">Leitura rápida</span>
                  <h2>Contexto da carteira</h2>
                </div>
              </header>

              <div className="portfolio-insight__content">
                <div>
                  <span>Maior posição cotada</span>
                  <strong>{largestPosition?.ticker ?? '—'}</strong>
                </div>
                <div>
                  <span>Ativos cotados com resultado positivo</span>
                  <strong>
                    {positiveAssets}
                    <small> de {quotedAssets.length}</small>
                  </strong>
                </div>
                <div>
                  <span>Fonte dos cálculos</span>
                  <strong>Seu histórico</strong>
                </div>
              </div>

              <p className="portfolio-insight__note">
                O preço médio e o saldo são reconstruídos com base nas operações da sua
                conta. Indicadores de mercado consideram somente ativos com cotação
                disponível.
              </p>
            </article>
          </div>

          <PortfolioAssetTable
            assets={summary.ativos}
            totalValue={summary.valorTotalCarteira}
          />
        </>
      )}
    </section>
  )
}
