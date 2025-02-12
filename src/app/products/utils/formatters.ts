export function formatTvl(tvl?: number | null) {
  if (tvl === undefined || tvl === null || tvl === 0) return ''

  return Intl.NumberFormat('en', {
    notation: 'compact',
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(tvl)
}

export function formatPercentage(
  percentage?: number | null,
  hideZeroPercentage: boolean = false,
  decimals: number = 2,
) {
  if (percentage === undefined || percentage === null) return ''
  if (percentage === 0 && hideZeroPercentage) return ''

  return new Intl.NumberFormat('en-us', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(percentage)
}

export function formatPrice(
  price?: number | bigint | null,
  digits: number = 2,
) {
  if (price === undefined || price === null) return ''

  return Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
    .format(price)
    .toString()
}
