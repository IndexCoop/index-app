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
