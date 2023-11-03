import { maxPriceImpact } from './config'
import { QuoteType } from './types'

export function getBestQuote(
  fullCosts0x: number | null,
  fullCostsEI: number | null,
  priceImpactDex: number
): { type: QuoteType; priceImpact: boolean } {
  if (fullCostsEI === null) {
    return { type: QuoteType.zeroEx, priceImpact: false }
  }

  const quotes: any[][] = []
  if (fullCosts0x) {
    quotes.push([QuoteType.zeroEx, fullCosts0x])
  }
  if (fullCostsEI) {
    quotes.push([QuoteType.flashMint, fullCostsEI])
  }
  const cheapestQuotes = quotes.sort((q1, q2) => q1[1] - q2[1])

  if (cheapestQuotes.length <= 0) {
    return { type: QuoteType.zeroEx, priceImpact: false }
  }

  const cheapestQuote = cheapestQuotes[0]
  const bestOption = cheapestQuote[0]

  // If only one quote, return best option immediately
  if (cheapestQuotes.length === 1) {
    return { type: bestOption, priceImpact: false }
  }

  // If multiple quotes, check price impact of 0x option
  if (bestOption === QuoteType.zeroEx && priceImpactDex >= maxPriceImpact) {
    // In case price impact is too high, return cheapest exchange issuance
    return { type: cheapestQuotes[1][0], priceImpact: true }
  }

  return { type: bestOption, priceImpact: false }
}
