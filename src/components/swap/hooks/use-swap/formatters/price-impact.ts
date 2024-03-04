import { colors } from '@/lib/styles/colors'

export function getPriceImpactColorCoding(
  priceImpact: number,
  isDarkMode: boolean,
): string {
  if (priceImpact < -5) {
    return colors.ic.red
  }

  if (priceImpact < -3) {
    return colors.ic.blue[500]
  }

  return isDarkMode ? colors.icGrayDarkMode : colors.icGrayLightMode
}

/**
 * Returns price impact in the format (x.yy%)
 */
export function getFormattedPriceImpact(
  priceImpact: number,
  isDarkMode: boolean,
): { priceImpact: string; colorCoding: string } | null {
  if (!priceImpact) return null
  const colorCoding = getPriceImpactColorCoding(priceImpact, isDarkMode)
  return { priceImpact: `(${priceImpact.toFixed(2)}%)`, colorCoding }
}
