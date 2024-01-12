import { Quote, QuoteType, ZeroExQuote } from '@/lib/hooks/use-best-quote/types'
import { displayFromWei } from '@/lib/utils'
import { getBlockExplorerContractUrl } from '@/lib/utils/block-explorer'
import { getNativeToken } from '@/lib/utils/tokens'

import { TradeInfoItem } from '../../types'
import { shouldShowWarningSign } from './formatters/index'

function formatIfNumber(value: string) {
  if (/[a-z]/i.test(value)) return value
  return Number(value).toLocaleString('en', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })
}

function getContractDetails(quote: Quote): TradeInfoItem {
  const contractBestOption = quote.contract
  const contractBlockExplorerUrl = getBlockExplorerContractUrl(
    contractBestOption,
    quote.chainId
  )
  return {
    isLink: true,
    title: 'Contract',
    values: [contractBestOption, contractBlockExplorerUrl],
  }
}

function getNetworkFee(quote: Quote): TradeInfoItem {
  const networkFee = displayFromWei(quote.gasCosts)
  const networkFeeDisplay = networkFee ? parseFloat(networkFee).toFixed(4) : '-'
  const networkToken = getNativeToken(quote.chainId)?.symbol ?? ''
  const formattedFee = `$${quote.gasCostsInUsd.toFixed(
    2
  )} (${networkFeeDisplay} ${networkToken})`
  return {
    title: 'Network Fee',
    tooltip:
      'This is often referred to as a “gas fee” and is charged by the blockchain network to securely process a transaction.',
    values: [formattedFee],
  }
}

function getOutputAmount(
  quote: Quote,
  bestQuoteIsFlashmint: boolean
): TradeInfoItem {
  const outputAmount = bestQuoteIsFlashmint
    ? quote.isMinting
      ? quote.indexTokenAmount
      : quote.inputOutputTokenAmount
    : (quote as ZeroExQuote).minOutput
  const decimals = bestQuoteIsFlashmint ? quote.outputToken.decimals : 18
  const minReceive = displayFromWei(outputAmount, 4, decimals) ?? '0.0'
  const minReceiveFormatted =
    formatIfNumber(minReceive) + ' ' + quote.outputToken.symbol

  return {
    title: 'Minimum ' + quote.outputToken.symbol + ' Received',
    values: [minReceiveFormatted],
  }
}

function getSlippageDetails(slippage: number): TradeInfoItem {
  const slippageFormatted = `${slippage}%`
  const slippageTitle = shouldShowWarningSign(slippage)
    ? `Max Slippage ⚠`
    : `Max Slippage`
  return {
    title: slippageTitle,
    tooltip:
      'Slippage refers to the difference between the expected price of a trade and the price at which the trade is executed.',
    values: [slippageFormatted],
  }
}

function getSources(
  quote: Quote,
  bestQuoteIsFlashmint: boolean
): TradeInfoItem {
  const offeredFromSources = bestQuoteIsFlashmint
    ? 'FlashMint'
    : (quote as ZeroExQuote).sources
        .filter((source) => Number(source.proportion) > 0)
        .map((source) => source.name)
  return { title: 'Offered From', values: [offeredFromSources.toString()] }
}

export function buildTradeDetails(quote: Quote | null): TradeInfoItem[] {
  if (!quote) return []
  const bestQuoteIsFlashmint = quote.type === QuoteType.flashmint
  const minimumReceived = getOutputAmount(quote, bestQuoteIsFlashmint)
  const networkFee = getNetworkFee(quote)
  const slippage = getSlippageDetails(quote.slippage)
  const sources = getSources(quote, bestQuoteIsFlashmint)
  const contract = getContractDetails(quote)
  return [minimumReceived, slippage, networkFee, contract, sources]
}
