export function getPriceImpactTextColor(priceImpact: number): string {
  if (priceImpact < -5) {
    return 'text-ic-red'
  }

  if (priceImpact < -3) {
    return 'text-ic-blue-500'
  }

  return 'text-[#aaa] dark:text-[#777]'
}

/**
 * Returns price impact in the format (x.yy%)
 */
export function getFormattedPriceImpact(
  priceImpact: number,
): { priceImpact: string; colorCoding: string } | null {
  if (!priceImpact) return null
  const colorCoding = getPriceImpactTextColor(priceImpact)
  return { priceImpact: `(${priceImpact.toFixed(2)}%)`, colorCoding }
}
