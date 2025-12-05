import { formatAmount, formatWei } from '@/lib/utils'

import { TradeDetailTokenPrices } from '../../../components/trade-details'

/**
 * Rounds to 2 decimal places. NOT precise, should only be used for display
 */
export function formattedBalance(
  tokenDecimals: number,
  tokenBalance: bigint | undefined,
) {
  const zero = '0.00'
  if (!tokenBalance) return zero
  const formattedBalance = Number(formatWei(tokenBalance, tokenDecimals))
  const formatted = formatAmount(formattedBalance, 3)
  return formatted
}

export function getFormattedTokenPrice(
  tokenSymbol: string,
  comparingTokenSymbol: string,
  tokenPrice: number,
): string {
  const isFractional = tokenPrice % 1 !== 0
  const price = isFractional ? tokenPrice.toFixed(4) : tokenPrice
  return `1 ${tokenSymbol} = ${price} ${comparingTokenSymbol}`
}

export function getFormattedTokenPrices(
  inputTokenSymbol: string,
  inputTokenAmount: number,
  inputTokenUsd: number,
  outputTokenSymbol: string,
  outputTokenAmount: number,
  outputTokenUsd: number,
): TradeDetailTokenPrices {
  const inputTokenPrice = outputTokenAmount / inputTokenAmount
  const outputTokenPrice = inputTokenAmount / outputTokenAmount
  const inputTokenPriceFormatted = getFormattedTokenPrice(
    inputTokenSymbol,
    outputTokenSymbol,
    inputTokenPrice,
  )
  const outputTokenPriceFormatted = getFormattedTokenPrice(
    outputTokenSymbol,
    inputTokenSymbol,
    outputTokenPrice,
  )
  const inputTokenPriceUsd = `($${formatAmount(inputTokenUsd)})`
  const outputTokenPriceUsd = `($${formatAmount(outputTokenUsd)})`
  return {
    inputTokenPrice: inputTokenPriceFormatted,
    inputTokenPriceUsd,
    outputTokenPrice: outputTokenPriceFormatted,
    outputTokenPriceUsd,
  }
}
