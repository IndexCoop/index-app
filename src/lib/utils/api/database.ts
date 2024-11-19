import { Trade } from '@prisma/client'
import { formatUnits } from 'viem'

import { Quote } from '@/lib/hooks/use-best-quote/types'

export const mapQuoteToTrade = (
  address: string,
  transactionHash: string,
  quote: Quote,
): Trade => ({
  transactionHash,
  userAddress: address,
  chainId: quote.chainId,
  from: quote.tx.from ?? null,
  to: quote.tx.to ?? null,
  quoteType: quote.type,
  gasUnits: quote.gas.toString(),
  gasPrice: quote.gasPrice.toString(),
  gasCost: quote.gasCosts.toString(),
  gasCostInUsd: quote.gasCostsInUsd,
  priceImpact: quote.priceImpact ?? null,
  inputTokenAddress: quote.inputToken.address!,
  inputTokenSymbol: quote.inputToken.symbol,
  inputTokenUnits: formatUnits(
    quote.inputTokenAmount.toBigInt(),
    quote.inputToken.decimals,
  ),
  inputTokenAmountWei: quote.inputTokenAmount.toString(),
  inputTokenAmountUsd: quote.inputTokenAmountUsd,
  inputTokenPriceUsd: quote.inputTokenPrice,
  outputTokenAddress: quote.outputToken.address!,
  outputTokenSymbol: quote.outputToken.symbol,
  outputTokenUnits: formatUnits(
    quote.outputTokenAmount.toBigInt(),
    quote.outputToken.decimals,
  ),
  outputTokenAmountWei: quote.outputTokenAmount.toString(),
  outputTokenAmountUsd: quote.outputTokenAmountUsd,
  outputTokenPriceUsd: quote.outputTokenPrice,
  slippage: quote.slippage,
  transactionType: quote.isMinting ? 'buy' : 'sell',
  mintFee: '',
  redeemFee: '',
  refId: null,
  createdAt: new Date(),
})
