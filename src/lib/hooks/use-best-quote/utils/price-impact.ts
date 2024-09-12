/**
 * Returns price impact in percent
 */
export function getPriceImpact(
  inputTokenPrice: number,
  outputTokenPrice: number,
): number | null {
  if (inputTokenPrice <= 0 || outputTokenPrice <= 0) {
    return null
  }

  const diff = Math.abs(inputTokenPrice - outputTokenPrice)
  let priceImpact = (diff / inputTokenPrice) * 100
  if (outputTokenPrice < inputTokenPrice) {
    priceImpact *= -1
  }

  return priceImpact
}
