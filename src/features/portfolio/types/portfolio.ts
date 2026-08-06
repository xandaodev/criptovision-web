export type PortfolioAsset = {
  ticker: string
  saldo: number
  precoAtual: number | null
  precoMedio: number
  valorTotalUSD: number | null
  porcentagemPNL: number | null
  variacao24h: number | null
  cotacaoDisponivel: boolean
  cotacaoDesatualizada: boolean
  cotacaoAtualizadaEm: string | null
}

export type PortfolioSummary = {
  valorTotalCarteira: number
  pnlGeral: number
  variacao24hCarteira: number
  ativos: PortfolioAsset[]
  cotacoesAtualizadasEm: string | null
  cotacoesParciais: boolean
  ativosSemCotacao: string[]
}
