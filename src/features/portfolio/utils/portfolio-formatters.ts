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

const quoteDateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
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

export function formatQuoteDateTime(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'horário desconhecido'
  }

  return quoteDateTimeFormatter.format(date)
}

export function formatQuoteAge(value: string | null): string {
  if (!value) {
    return 'horário desconhecido'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'horário desconhecido'
  }

  const elapsedMilliseconds = Math.max(0, Date.now() - date.getTime())
  const elapsedMinutes = Math.floor(elapsedMilliseconds / 60_000)

  if (elapsedMinutes < 1) {
    return 'agora'
  }

  if (elapsedMinutes < 60) {
    return `há ${elapsedMinutes} ${elapsedMinutes === 1 ? 'minuto' : 'minutos'}`
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60)

  if (elapsedHours < 24) {
    return `há ${elapsedHours} ${elapsedHours === 1 ? 'hora' : 'horas'}`
  }

  const elapsedDays = Math.floor(elapsedHours / 24)
  return `há ${elapsedDays} ${elapsedDays === 1 ? 'dia' : 'dias'}`
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
