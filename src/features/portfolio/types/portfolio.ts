export type PortfolioAsset = {
  ticker: string
  saldo: number
  precoAtual: number
  precoMedio: number
  valorTotalUSD: number
  porcentagemPNL: number
  variacao24h: number
}

export type PortfolioSummary = {
  valorTotalCarteira: number
  pnlGeral: number
  variacao24hCarteira: number
  ativos: PortfolioAsset[]
}
