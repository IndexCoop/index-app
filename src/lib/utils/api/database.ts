import { Trade } from '@prisma/client'

import { Quote } from '@/lib/hooks/use-best-quote/types'
import { formatUnits } from 'viem'

export const mapQuoteToTrade = (
  address: string,
  transactionHash: string,
  quote: Quote,
): Trade => ({
  transactionHash,
  userAddress: address,
  chainId: quote.chainId,
  isMint: quote.isMinting,
  from: quote.tx.from ?? null,
  to: quote.tx.to ?? null,
  type: quote.type,
  inputToken: quote.inputToken.symbol,
  outputToken: quote.outputToken.symbol,
  inputTokenAmount: formatUnits(
    quote.inputTokenAmount.toBigInt(),
    quote.inputToken.decimals,
  ),
  outputTokenAmount: formatUnits(
    quote.outputTokenAmount.toBigInt(),
    quote.outputToken.decimals,
  ),
  gas: quote.gas.toString(),
  gasPrice: quote.gasPrice.toString(),
  gasCosts: quote.gasCosts.toString(),
  gasCostsInUsd: quote.gasCostsInUsd,
  fullCostsInUsd: quote.fullCostsInUsd ?? null,
  priceImpact: quote.priceImpact ?? null,
  indexTokenAmount: quote.indexTokenAmount.toString(),
  inputOutputTokenAmount: quote.inputOutputTokenAmount.toString(),
  inputTokenAmountUsd: quote.inputTokenAmountUsd,
  outputTokenAmountUsd: quote.outputTokenAmountUsd,
  outputTokenAmountUsdAfterFees: quote.outputTokenAmountUsdAfterFees,
  inputTokenPrice: quote.inputTokenPrice,
  outputTokenPrice: quote.outputTokenPrice,
  slippage: quote.slippage,
  createdAt: new Date(),
})