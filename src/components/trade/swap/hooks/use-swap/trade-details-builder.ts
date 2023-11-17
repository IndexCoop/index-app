import { shouldShowWarningSign } from '@/components/trade/_shared/QuickTradeFormatter'
import {
  Quote,
  QuoteResult,
  QuoteType,
  ZeroExQuote,
} from '@/lib/hooks/use-best-quote/types'
import { displayFromWei } from '@/lib/utils'
import { getBlockExplorerContractUrl } from '@/lib/utils/blockExplorer'
import { getNativeToken } from '@/lib/utils/tokens'

import { TradeInfoItem } from '../../types'

const formatIfNumber = (value: string) => {
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
  return {
    title: 'Network Fee',
    values: [
      `${networkFeeDisplay} ${networkToken} ($${quote.gasCostsInUsd.toFixed(
        2
      )})`,
    ],
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
  const minReceive =
    displayFromWei(outputAmount, 4, quote.outputToken.decimals) ?? '0.0'
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
    ? `Slippage ⚠`
    : `Slippage`
  return {
    title: slippageTitle,
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

export function buildTradeDetails(
  quoteResult: QuoteResult | null
): TradeInfoItem[] {
  if (quoteResult === null) return []
  const { flashmint, zeroex } = quoteResult.quotes
  const bestQuoteIsFlashmint = quoteResult.bestQuote === QuoteType.flashmint
  const quote = bestQuoteIsFlashmint ? flashmint : zeroex
  if (!quote) return []
  const minimumReceived = getOutputAmount(quote, bestQuoteIsFlashmint)
  const networkFee = getNetworkFee(quote)
  const slippage = getSlippageDetails(quote.slippage)
  const sources = getSources(quote, bestQuoteIsFlashmint)
  const contract = getContractDetails(quote)
  return [minimumReceived, networkFee, slippage, contract, sources]
}
