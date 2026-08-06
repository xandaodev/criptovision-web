import type { PortfolioAsset } from '../types/portfolio.ts'

export type QuotedPortfolioAsset = PortfolioAsset & {
  precoAtual: number
  valorTotalUSD: number
  porcentagemPNL: number
  variacao24h: number
}

export function hasAvailableQuote(
  asset: PortfolioAsset,
): asset is QuotedPortfolioAsset {
  return (
    asset.cotacaoDisponivel &&
    asset.precoAtual !== null &&
    asset.valorTotalUSD !== null &&
    asset.porcentagemPNL !== null &&
    asset.variacao24h !== null
  )
}

export function uniqueTickers(tickers: string[]): string[] {
  return [...new Set(tickers)].sort((first, second) => first.localeCompare(second))
}
