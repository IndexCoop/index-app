const currencyConfig: Record<
  string,
  { symbol: string; options: Intl.NumberFormatOptions }
> = {
  ETH: {
    symbol: 'Ξ',
    options: {
      maximumFractionDigits: 4,
      minimumFractionDigits: 4,
      currencyDisplay: 'narrowSymbol',
      currency: 'ETH',
      style: 'currency',
    },
  },
  BTC: {
    symbol: '₿',
    options: {
      maximumFractionDigits: 4,
      minimumFractionDigits: 4,
      currencyDisplay: 'narrowSymbol',
      currency: 'BTC',
      style: 'currency',
    },
  },
  USD: {
    symbol: '$',
    options: {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      currency: 'USD',
      style: 'currency',
      currencyDisplay: 'narrowSymbol',
    },
  },
}

export const formatAmount = (amount: number = 0, denominator?: unknown) => {
  if (!denominator || typeof denominator !== 'string') {
    return amount.toLocaleString(navigator.language, currencyConfig.USD.options)
  }

  const config = currencyConfig[denominator] ?? currencyConfig.USD

  return amount
    .toLocaleString(navigator.language, config.options)
    .replace(config.options.currency!, config.symbol)
}
