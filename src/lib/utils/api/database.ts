import {
  getTokenByChainAndAddress,
  getUnderlyingToken,
  isLeverageToken,
} from '@indexcoop/tokenlists'
import { formatUnits } from 'viem'

import type { UtmParam } from '@/app/store/utm-atoms'
import type { PostApiV2TradeMutationRequest } from '@/gen'
import type { Quote } from '@/lib/hooks/use-best-quote/types'

export const mapQuoteToTrade = (
  address: string,
  transactionHash: string,
  quote: Quote,
  utm: Partial<Record<UtmParam, string>>,
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
  priceImpact: null,
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
  mintFee: quote.fees
    ? (quote.inputTokenAmountUsd * quote.fees.mint).toString()
    : '',
  redeemFee: quote.fees
    ? (quote.inputTokenAmountUsd * quote.fees.redeem).toString()
    : '',
  utm: utm.utm_source
    ? (utm as PostApiV2TradeMutationRequest['utm'])
    : undefined,
  createdAt: new Date(),
  underlyingAssetSymbol: getUnderlyingAssetSymbol(quote).toUpperCase(),
})

const getUnderlyingAssetSymbol = (quote: Quote) => {
  const possible = [
    'ETH',
    'BTC',
    'SUI',
    'SOL',
    'XRP',
    'AAVE',
    'ARB',
    'LINK',
    'XAUt',
    'MATIC',
  ]

  const address = quote.isMinting
    ? quote.outputToken.address
    : quote.inputToken.address

  const token = getTokenByChainAndAddress(quote.chainId, address)

  if (isLeverageToken(token)) {
    const { symbol } = getUnderlyingToken(token)

    return possible.find((p) => symbol.includes(p)) ?? ''
  }

  return possible.find((p) => token?.symbol.includes(p)) ?? ''
}
