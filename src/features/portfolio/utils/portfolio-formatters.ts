const usdTotalFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const usdPreciseFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 18,
})

const quantityFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 18,
})

const percentageFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function formatUsdTotal(value: number): string {
  return usdTotalFormatter.format(value)
}

export function formatUsdPrice(value: number): string {
  if (value === 0 || Math.abs(value) >= 1) {
    return usdTotalFormatter.format(value)
  }

  return usdPreciseFormatter.format(value)
}

export function formatQuantity(value: number): string {
  return quantityFormatter.format(value)
}

export function formatPercentage(value: number, showPositiveSign = false): string {
  const sign = showPositiveSign && value > 0 ? '+' : ''
  return `${sign}${percentageFormatter.format(value)}%`
}

export function getPerformanceClass(value: number): string {
  if (value > 0) {
    return 'performance performance--positive'
  }

  if (value < 0) {
    return 'performance performance--negative'
  }

  return 'performance performance--neutral'
}
