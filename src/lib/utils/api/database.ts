import { formatUnits } from 'viem'

import { PostApiV2TradeMutationRequest } from '@/gen'
import { Quote } from '@/lib/hooks/use-best-quote/types'

export const mapQuoteToTrade = (
  address: string,
  transactionHash: string,
  quote: Quote,
): PostApiV2TradeMutationRequest => ({
  transactionHash,
  userAddress: address,
  chainId: quote.chainId,
  from: quote.tx.from ?? null,
  to: quote.tx.to ?? null,
  quoteType: quote.type === 'index' ? 'swap' : quote.type,
  gasUnits: quote.gas.toString(),
  gasPrice: quote.gasPrice.toString(),
  gasCost: quote.gasCosts.toString(),
  gasCostInUsd: quote.gasCostsInUsd,
  priceImpact: quote.priceImpact ?? null,
  inputTokenAddress: quote.inputToken.address!,
  inputTokenSymbol: quote.inputToken.symbol,
  inputTokenUnits: formatUnits(
    quote.inputTokenAmount,
    quote.inputToken.decimals,
  ),
  inputTokenAmountWei: quote.inputTokenAmount.toString(),
  inputTokenAmountUsd: quote.inputTokenAmountUsd,
  inputTokenPriceUsd: quote.inputTokenPrice,
  outputTokenAddress: quote.outputToken.address!,
  outputTokenSymbol: quote.outputToken.symbol,
  outputTokenUnits: formatUnits(
    quote.outputTokenAmount,
    quote.outputToken.decimals,
  ),
  outputTokenAmountWei: quote.outputTokenAmount.toString(),
  outputTokenAmountUsd: quote.outputTokenAmountUsd,
  outputTokenPriceUsd: quote.outputTokenPrice,
  slippage: quote.slippage,
  transactionType: quote.isMinting ? 'buy' : 'sell',
  mintFee: 'THIS WILL COME FROM THE QUOTE',
  redeemFee: 'THIS WILL COME FROM THE QUOTE',
  refId: 'indexcoop', // TODO: if we have a refId as a queryParam or any other way, set it here.
  createdAt: new Date(),
})
