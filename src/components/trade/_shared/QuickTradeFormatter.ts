import { colors } from '@/lib/styles/colors'

import { BigNumber } from '@ethersproject/bignumber'

import { Token } from '@/constants/tokens'
import { displayFromWei } from '@/lib/utils'
import { getNativeToken } from '@/lib/utils/tokens'

import { TradeDetailTokenPrices } from '../swap/components/trade-details'
import { TradeInfoItem } from '../swap/components/trade-details/trade-info'

export function getPriceImpactColorCoding(
  priceImpact: number,
  isDarkMode: boolean
): string {
  if (priceImpact < -5) {
    return colors.icRed
  }

  if (priceImpact < -3) {
    return colors.icBlue
  }

  return isDarkMode ? colors.icGrayDarkMode : colors.icGrayLightMode
}

/**
 * Returns price impact as percent
 */
export function getPriceImpact(
  inputTokenAmount: number,
  inputTokenPrice: number,
  outputokenAmount: number,
  outputTokenPrice: number
): number | null {
  if (inputTokenAmount <= 0 || outputokenAmount <= 0) {
    return null
  }

  const inputTotal = inputTokenAmount * inputTokenPrice
  const outputTotal = outputokenAmount * outputTokenPrice

  const diff = inputTotal - outputTotal
  const priceImpact = (diff / inputTotal) * -100

  return priceImpact
}

/**
 * Rounds to 2 decimal places. NOT precise, should only be used for display
 */
export function formattedBalance(
  token: Token,
  tokenBalance: BigNumber | undefined
) {
  const zero = '0.00'
  return tokenBalance
    ? displayFromWei(tokenBalance, 2, token.decimals) || zero
    : zero
}

export function getFormattedOuputTokenAmount(
  bestOptionIsTypeEI: boolean,
  ouputTokenDecimals: number,
  zeroExTradeDataOutputAmount: BigNumber | undefined,
  exchangeIssuanceOutputAmount: BigNumber | undefined
): string {
  if (
    (bestOptionIsTypeEI && !exchangeIssuanceOutputAmount) ||
    (!bestOptionIsTypeEI && !zeroExTradeDataOutputAmount) ||
    (zeroExTradeDataOutputAmount?.isZero() &&
      exchangeIssuanceOutputAmount?.isZero())
  ) {
    return '0.0'
  }

  if (bestOptionIsTypeEI) {
    return (
      displayFromWei(exchangeIssuanceOutputAmount, 4, ouputTokenDecimals) ??
      '0.0'
    )
  }

  // 0x quotes are always in wei (18 decimals)
  return displayFromWei(zeroExTradeDataOutputAmount, 4, 18) ?? '0.0'
}

export function getFormattedTokenPrice(
  tokenSymbol: string,
  comparingTokenSymbol: string,
  tokenPrice: number,
  comparingTokenPrice: number
): string {
  const percent =
    comparingTokenPrice === 0 ? 0 : tokenPrice / comparingTokenPrice
  const isFractional = percent % 1 !== 0
  const price = isFractional ? percent.toFixed(3) : percent
  return `1 ${tokenSymbol} = ${price} ${comparingTokenSymbol}`
}

export function getFormattedTokenPrices(
  inputTokenSymbol: string,
  inputTokenUsd: number,
  outputTokenSymbol: string,
  outputTokenUsd: number
): TradeDetailTokenPrices {
  const inputTokenPrice = getFormattedTokenPrice(
    inputTokenSymbol,
    outputTokenSymbol,
    inputTokenUsd,
    outputTokenUsd
  )
  const inputTokenPriceUsd = `($${inputTokenUsd.toFixed(2)})`
  const outputTokenPrice = getFormattedTokenPrice(
    outputTokenSymbol,
    inputTokenSymbol,
    outputTokenUsd,
    inputTokenUsd
  )
  const outputTokenPriceUsd = `($${outputTokenUsd.toFixed(2)})`
  return {
    inputTokenPrice,
    inputTokenPriceUsd,
    outputTokenPrice,
    outputTokenPriceUsd,
  }
}

export function formattedFiat(tokenAmount: number, tokenPrice: number): string {
  const price = (tokenAmount * tokenPrice).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return price
}

/**
 * Returns price impact in the format (x.yy%)
 */
export function getFormattedPriceImpact(
  inputTokenAmount: number,
  inputTokenPrice: number,
  outputokenAmount: number,
  outputTokenPrice: number,
  isDarkMode: boolean
): { priceImpact: string; colorCoding: string } | null {
  const priceImpact = getPriceImpact(
    inputTokenAmount,
    inputTokenPrice,
    outputokenAmount,
    outputTokenPrice
  )

  if (!priceImpact) {
    return null
  }

  const colorCoding = getPriceImpactColorCoding(priceImpact, isDarkMode)
  return { priceImpact: `(${priceImpact.toFixed(2)}%)`, colorCoding }
}

export const getHasInsufficientFunds = (
  bestOptionUnavailable: boolean,
  sellAmount: BigNumber,
  sellTokenBalance: BigNumber | undefined
): boolean => {
  if (
    bestOptionUnavailable ||
    sellAmount.isZero() ||
    sellAmount.isNegative() ||
    sellTokenBalance === undefined
  )
    return false

  const hasInsufficientFunds = sellAmount.gt(sellTokenBalance)
  return hasInsufficientFunds
}

const formatIfNumber = (value: string) => {
  if (/[a-z]/i.test(value)) return value

  return Number(value).toLocaleString('en', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })
}

export function getTradeInfoData0x(
  buyToken: Token,
  gasCosts: BigNumber,
  gasCostsInUsd: number,
  minOutput: BigNumber,
  sources: { name: string; proportion: string }[],
  chainId: number = 1,
  slippage: number,
  showSlippageWarning: boolean,
  contractBestOption: string,
  contractBlockExplorerUrl: string
): TradeInfoItem[] {
  const minReceive = displayFromWei(minOutput, 4) ?? '0.0'
  const minReceiveFormatted = formatIfNumber(minReceive) + ' ' + buyToken.symbol

  const networkFee = displayFromWei(gasCosts)
  const networkFeeDisplay = networkFee ? parseFloat(networkFee).toFixed(4) : '-'
  const networkToken = getNativeToken(chainId)?.symbol ?? ''

  const offeredFromSources = sources
    .filter((source) => Number(source.proportion) > 0)
    .map((source) => source.name)

  const slippageFormatted = `${slippage}%`
  const slippageTitle = showSlippageWarning ? `Slippage ⚠` : `Slippage`

  return [
    {
      title: 'Minimum ' + buyToken.symbol + ' Received',
      values: [minReceiveFormatted],
    },
    {
      title: 'Network Fee',
      values: [
        `${networkFeeDisplay} ${networkToken} ($${gasCostsInUsd.toFixed(2)})`,
      ],
    },
    {
      title: slippageTitle,
      values: [slippageFormatted],
    },
    {
      isLink: true,
      title: 'Contract',
      values: [contractBestOption, contractBlockExplorerUrl],
    },
    { title: 'Offered From', values: [offeredFromSources.toString()] },
  ]
}

export function shouldShowWarningSign(slippage: number): boolean {
  return slippage > 1
}
