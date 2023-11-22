import { colors } from '@/lib/styles/colors'

export function getPriceImpactColorCoding(
  priceImpact: number,
  isDarkMode: boolean
): string {
  if (priceImpact < -5) {
    return colors.icRed
  }

  if (priceImpact < -3) {
    return colors.icBlue
  }

  return isDarkMode ? colors.icGrayDarkMode : colors.icGrayLightMode
}

/**
 * Returns price impact as percent
 */
export function getPriceImpact(
  inputTokenAmount: number,
  inputTokenPrice: number,
  outputokenAmount: number,
  outputTokenPrice: number
): number | null {
  if (inputTokenAmount <= 0 || outputokenAmount <= 0) {
    return null
  }

  const inputTotal = inputTokenAmount * inputTokenPrice
  const outputTotal = outputokenAmount * outputTokenPrice

  const diff = inputTotal - outputTotal
  const priceImpact = (diff / inputTotal) * -100

  return priceImpact
}

/**
 * Returns price impact in the format (x.yy%)
 */
export function getFormattedPriceImpact(
  inputTokenAmount: number,
  inputTokenPrice: number,
  outputokenAmount: number,
  outputTokenPrice: number,
  isDarkMode: boolean
): { priceImpact: string; colorCoding: string } | null {
  const priceImpact = getPriceImpact(
    inputTokenAmount,
    inputTokenPrice,
    outputokenAmount,
    outputTokenPrice
  )

  if (!priceImpact) {
    return null
  }

  const colorCoding = getPriceImpactColorCoding(priceImpact, isDarkMode)
  return { priceImpact: `(${priceImpact.toFixed(2)}%)`, colorCoding }
}
