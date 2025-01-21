import { formatUnits } from 'viem'

import { Quote } from '@/lib/hooks/use-best-quote/types'

import type { PostApiV2TradeMutationRequest } from '@/gen'

export const mapQuoteToTrade = (
  address: string,
  transactionHash: string,
  quote: Quote,
  refId?: string,
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
  inputTokenSymbol: quote.inputToken.symbol.toUpperCase(),
  inputTokenUnits: formatUnits(
    quote.inputTokenAmount,
    quote.inputToken.decimals,
  ),
  inputTokenAmountWei: quote.inputTokenAmount.toString(),
  inputTokenAmountUsd: quote.inputTokenAmountUsd,
  inputTokenPriceUsd: quote.inputTokenPrice,
  outputTokenAddress: quote.outputToken.address!,
  outputTokenSymbol: quote.outputToken.symbol.toUpperCase(),
  outputTokenUnits: formatUnits(
    quote.outputTokenAmount,
    quote.outputToken.decimals,
  ),
  outputTokenAmountWei: quote.outputTokenAmount.toString(),
  outputTokenAmountUsd: quote.outputTokenAmountUsd,
  outputTokenPriceUsd: quote.outputTokenPrice,
  slippage: quote.slippage,
  transactionType: quote.isMinting ? 'buy' : 'sell',
  mintFee: quote.fees?.mintUsd.toString() ?? '',
  redeemFee: quote.fees?.redeemUsd.toString() ?? '',
  refId,
  createdAt: new Date(),
  underlyingAssetSymbol: getUnderlyingAssetSymbol(quote).toUpperCase(),
})

const getUnderlyingAssetSymbol = (quote: Quote) => {
  const symbol = (quote.isMinting ? quote.outputToken : quote.inputToken).symbol

  if (symbol.startsWith('ETH') || symbol.startsWith('iBTC1X')) return 'ETH'
  if (symbol.startsWith('BTC') || symbol.startsWith('iETH1X')) return 'BTC'

  return ''
}
