import { Quote, QuoteType, ZeroExQuote } from '@/lib/hooks/use-best-quote/types'
import { getBlockExplorerContractUrl } from '@/lib/utils/block-explorer'

import { TradeInfoItem } from '../../types'

import { shouldShowWarningSign } from './formatters/index'

function getContractDetails(quote: Quote): TradeInfoItem {
  const contractBestOption = quote.contract
  const contractBlockExplorerUrl = getBlockExplorerContractUrl(
    contractBestOption,
    quote.chainId,
  )
  return {
    isLink: true,
    title: 'Contract',
    values: [contractBestOption, contractBlockExplorerUrl],
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
  bestQuoteIsFlashmint: boolean,
): TradeInfoItem {
  const offeredFromSources = bestQuoteIsFlashmint
    ? 'FlashMint'
    : (quote as ZeroExQuote).sources
        .filter((source) => Number(source.proportion) > 0)
        .map((source) => source.name)
  return { title: 'Offered from', values: [offeredFromSources.toString()] }
}

export function buildTradeDetails(quote: Quote | null): TradeInfoItem[] {
  if (!quote) return []
  const isQuoteTypeFlashMint = quote.type === QuoteType.flashmint
  const slippage = getSlippageDetails(quote.slippage)
  const sources = getSources(quote, isQuoteTypeFlashMint)
  const contract = getContractDetails(quote)
  return [slippage, contract, sources]
}
