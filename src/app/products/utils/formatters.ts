export function formatTvl(
  tvl?: number | null,
) {
  if (tvl === undefined || tvl === null || tvl === 0) return ''

  return Intl.NumberFormat('en', {
    notation: 'compact',
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(tvl)
}

export function formatPercentage(
  percentage?: number | null,
  hideZeroPercentage: boolean = false,
) {
  if (percentage === undefined || percentage === null) return ''
  if (percentage === 0 && hideZeroPercentage) return ''

  return `${percentage.toFixed(2)}%`
}

export function formatPrice(price?: number | bigint | null) {
  if (price === undefined || price === null) return ''

  return Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(price)
    .toString()
}
