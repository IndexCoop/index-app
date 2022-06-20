import { BigNumber } from 'ethers'

import { POLYGON } from 'constants/chains'
import { extractPoolFees } from 'utils/UniswapPath'
import { get0xQuote } from 'utils/zeroExUtils'

import {
  Exchange,
  LeveragedTokenData,
  SwapData,
} from './exchangeIssuanceQuotes'

// Used for redeeming (buy debt, sell collateral)
// Returns collateral amount needed to be sold
export const getSwapDataCollateralDebt = async (
  leveragedTokenData: LeveragedTokenData,
  includedSources: string,
  slippagePercentage = 0.5,
  chainId: number = POLYGON.chainId
) => {
  let result = await getSwapData(
    {
      buyToken: leveragedTokenData.debtToken,
      buyAmount: leveragedTokenData.debtAmount.toString(),
      sellToken: leveragedTokenData.collateralToken,
      includedSources,
    },
    chainId,
    slippagePercentage
  )
  if (!result) return null
  const { swapData: swapDataDebtCollateral, zeroExQuote } = result
  const collateralSold = BigNumber.from(zeroExQuote.sellAmount)
  return { swapDataDebtCollateral, collateralObtainedOrSold: collateralSold }
}

// Used for issuance (buy collateral, sell debt)
// Returns collateral amount bought
export const getSwapDataDebtCollateral = async (
  leveragedTokenData: LeveragedTokenData,
  includedSources: string,
  slippagePercentage = 0.5,
  chainId: number = POLYGON.chainId
) => {
  let result = await getSwapData(
    {
      buyToken: leveragedTokenData.collateralToken,
      sellAmount: leveragedTokenData.debtAmount.toString(),
      sellToken: leveragedTokenData.debtToken,
      includedSources,
    },
    chainId,
    slippagePercentage
  )
  if (!result) return null
  const { swapData: swapDataDebtCollateral, zeroExQuote } = result
  const collateralObtained = BigNumber.from(zeroExQuote.buyAmount)
  return {
    swapDataDebtCollateral,
    collateralObtainedOrSold: collateralObtained,
  }
}

export const getSwapData = async (
  params: any,
  chainId: number = 137,
  slippagePercentage: number
) => {
  // TODO: error handling (for INSUFFICIENT_ASSET_LIQUIDITY)
  const zeroExQuote = await get0xQuote(
    {
      ...params,
      slippagePercentage: slippagePercentage / 100,
    },
    chainId
  )
  const swapData = swapDataFrom0xQuote(zeroExQuote)
  if (swapData) return { swapData, zeroExQuote }
  return null
}

function getEchangeFrom0xKey(key: string | undefined): Exchange | null {
  switch (key) {
    case 'Curve':
      return Exchange.Curve
    case 'QuickSwap':
      return Exchange.Quickswap
    case 'SushiSwap':
      return Exchange.Sushiswap
    case 'Uniswap_V3':
      return Exchange.UniV3
    default:
      return null
  }
}

export function swapDataFrom0xQuote(zeroExQuote: any): SwapData | null {
  if (
    zeroExQuote === undefined ||
    zeroExQuote === null ||
    zeroExQuote.orders === undefined ||
    zeroExQuote.orders.length < 1
  )
    return null

  const order = zeroExQuote.orders[0]
  const fillData = order.fillData
  const exchange = getEchangeFrom0xKey(order.source)

  if (!fillData || !exchange) return null

  if (exchange === Exchange.Curve) {
    return swapDataFromCurve(order)
  }

  let fees: number[] = []
  if (exchange === Exchange.UniV3) {
    fees = fillData.uniswapPath ? extractPoolFees(fillData.uniswapPath) : [500]
  }

  // Currently this works for Sushi, needs to be checked with additional exchanges
  return {
    exchange,
    path: fillData.tokenAddressPath,
    fees,
    pool: '0x0000000000000000000000000000000000000000',
  }
}

function swapDataFromCurve(order: any): SwapData | null {
  const fillData = order.fillData
  if (!fillData) return null
  return {
    exchange: Exchange.Curve,
    path: fillData.pool.tokens,
    fees: [],
    pool: fillData.pool.poolAddress,
  }
}
