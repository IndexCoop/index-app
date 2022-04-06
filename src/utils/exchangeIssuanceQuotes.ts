import { BigNumber, ethers } from 'ethers'

import { ChainId } from '@usedapp/core'

import { Token } from 'constants/tokens'
import {
  getExchangeIssuanceLeveragedContract,
  getLeveragedTokenData,
} from 'hooks/useExchangeIssuanceLeveraged'
import {
  getRequiredIssuanceComponents,
  getRequiredRedemptionComponents,
} from 'hooks/useExchangeIssuanceZeroEx'
import { displayFromWei, toWei } from 'utils'
import { getIssuanceModule } from 'utils/issuanceModule'
import { get0xQuote } from 'utils/zeroExUtils'

export interface ExchangeIssuanceQuote {
  tradeData: string[]
  inputTokenAmount: BigNumber
}

export interface LeveragedExchangeIssuanceQuote {
  swapDataDebtCollateral: SwapData
  swapDataPaymentToken: SwapData
  inputTokenAmount: BigNumber
  setTokenAmount: BigNumber
  gasPrice: BigNumber
}

export enum Exchange {
  None,
  Quickswap,
  Sushiswap,
  UniV3,
  Curve,
}

export interface SwapData {
  exchange: Exchange
  path: string[]
  fees: number[]
  pool: string
}

export interface LeveragedTokenData {
  collateralAToken: Token
  collateralToken: Token
  debtToken: Token
  collateralAmount: BigNumber
  debtAmount: BigNumber
}

// 0x keys https://github.com/0xProject/protocol/blob/4f32f3174f25858644eae4c3de59c3a6717a757c/packages/asset-swapper/src/utils/market_operation_utils/types.ts#L38
function get0xEchangeKey(exchange: Exchange): string {
  switch (exchange) {
    case Exchange.Curve:
      return 'Curve'
    case Exchange.Quickswap:
      return 'QuickSwap'
    case Exchange.Sushiswap:
      return 'SushiSwap'
    case Exchange.UniV3:
      return 'Uniswap_V3'
    default:
      return ''
  }
}

/**
 * Returns exchange issuance quotes (incl. 0x trade data) or null
 *
 * @param buyToken            The token to buy
 * @param buyTokenAmount      The amount of buy token that should be acquired
 * @param sellToken           The sell token
 * @param chainId             ID for current chain
 * @param library             Web3Provider instance
 *
 * @return tradeData           Array of 0x trade data for the individual positions
 * @return inputTokenAmount    Needed input token amount for trade
 */
export const getExchangeIssuanceQuotes = async (
  buyToken: Token,
  buyTokenAmount: BigNumber,
  sellToken: Token,
  isIssuance: boolean,
  chainId: ChainId = ChainId.Mainnet,
  library: ethers.providers.Web3Provider | undefined
): Promise<ExchangeIssuanceQuote | null> => {
  const tokenSymbol = isIssuance ? buyToken.symbol : sellToken.symbol
  const issuanceModule = getIssuanceModule(tokenSymbol, chainId)

  const { components, positions } = isIssuance
    ? await getRequiredIssuanceComponents(
        library,
        issuanceModule.address,
        issuanceModule.isDebtIssuance,
        buyToken.address!,
        buyTokenAmount
      )
    : await getRequiredRedemptionComponents(
        library,
        issuanceModule.address,
        issuanceModule.isDebtIssuance,
        sellToken.address!,
        buyTokenAmount
      )

  let positionQuotes: string[] = []
  let inputTokenAmount = BigNumber.from(0)
  // Slippage hard coded to .5% (will be increased if there are revert issues)
  const slippagePercents = 0.5
  // 0xAPI expects percentage as value between 0-1 e.g. 5% -> 0.05
  const slippagePercentage = slippagePercents / 100

  const quotePromises: Promise<any>[] = []
  components.forEach((component, index) => {
    const buyAmount = positions[index]
    const buyTokenAddress = component
    const sellTokenAddress =
      sellToken.symbol === 'ETH' ? 'ETH' : sellToken.address

    if (buyTokenAddress === sellTokenAddress) {
      inputTokenAmount = inputTokenAmount.add(buyAmount)
    } else {
      const quotePromise = get0xQuote(
        {
          buyToken: buyTokenAddress,
          sellToken: sellTokenAddress,
          buyAmount: buyAmount.toString(),
          slippagePercentage,
        },
        chainId ?? 1
      )
      quotePromises.push(quotePromise)
    }
  })

  const results = await Promise.all(quotePromises)
  if (results.length < 1) return null

  positionQuotes = results.map((result) => result.data)
  inputTokenAmount = results
    .map((result) => BigNumber.from(result.sellAmount))
    .reduce((prevValue, currValue) => {
      return currValue.add(prevValue)
    })

  // Christn: I assume that this is the correct math to make sure we have enough weth to cover the slippage
  // based on the fact that the slippagePercentage is limited between 0.0 and 1.0 on the 0xApi
  inputTokenAmount = inputTokenAmount
    .mul(toWei(100, sellToken.decimals))
    .div(toWei(100 - slippagePercents, sellToken.decimals))

  return { tradeData: positionQuotes, inputTokenAmount }
}

export const getLeveragedExchangeIssuanceQuotes = async (
  setToken: Token,
  setTokenAmount: BigNumber,
  paymentToken: Token,
  isIssuance: boolean,
  chainId: ChainId = ChainId.Mainnet,
  library: ethers.providers.Web3Provider | undefined
): Promise<LeveragedExchangeIssuanceQuote | null> => {
  const tokenSymbol = setToken.symbol
  const isIcEth = tokenSymbol === 'icETH'

  const setTokenAddress =
    chainId === ChainId.Polygon ? setToken.polygonAddress : setToken.address
  const contract = await getExchangeIssuanceLeveragedContract(
    library?.getSigner(),
    chainId
  )
  const leveragedTokenData: LeveragedTokenData = await getLeveragedTokenData(
    contract,
    setTokenAddress ?? '',
    setTokenAmount,
    isIssuance
  )

  // TODO: multi sources?
  //TODO: Allow Quickswap and UniV3
  let includedSources: string = isIcEth
    ? [get0xEchangeKey(Exchange.Curve)].toString()
    : [get0xEchangeKey(Exchange.Sushiswap)].toString()

  let { swapDataDebtCollateral, collateralObtained } = isIssuance
    ? await getSwapDataDebtCollateral(
        leveragedTokenData,
        includedSources,
        chainId
      )
    : await getSwapDataCollateralDebt(
        leveragedTokenData,
        includedSources,
        chainId
      )

  const collateralShortfall =
    leveragedTokenData.collateralAmount.sub(collateralObtained)

  const WMATIC_ADDRESS = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
  let paymentTokenAddress =
    chainId === ChainId.Polygon && paymentToken.symbol === 'MATIC'
      ? WMATIC_ADDRESS
      : chainId === ChainId.Polygon
      ? paymentToken.polygonAddress
      : paymentToken.address
  if (paymentToken.symbol === 'ETH') {
    paymentTokenAddress = 'ETH'
  }

  if (isIssuance) {
    if (isIcEth) {
      swapDataDebtCollateral.exchange = Exchange.Curve
      swapDataDebtCollateral.path = []
      swapDataDebtCollateral.pool = '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022'
    } else {
      swapDataDebtCollateral.exchange = Exchange.Sushiswap
      swapDataDebtCollateral.path = []
      // pool should be zero address
    }
  } else {
    if (isIcEth) {
      paymentTokenAddress = '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84' // stETH
      swapDataDebtCollateral.exchange = Exchange.Curve
      swapDataDebtCollateral.path = []
      swapDataDebtCollateral.pool = '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022'
    } else {
      swapDataDebtCollateral.exchange = Exchange.Sushiswap
      swapDataDebtCollateral.path = []
      swapDataDebtCollateral.pool = '0x34965ba0ac2451a34a0471f04cca3f990b8dea27'
    }
  }

  const { swapData: swapDataPaymentToken, zeroExQuote } = await getSwapData(
    {
      buyToken: isIssuance
        ? leveragedTokenData.collateralToken
        : leveragedTokenData.debtToken,
      buyAmount: collateralShortfall.toString(),
      sellToken: paymentTokenAddress,
      includedSources,
    },
    chainId
  )
  const inputTokenAmount = BigNumber.from(zeroExQuote.sellAmount)

  if (isIcEth) {
    swapDataPaymentToken.exchange = Exchange.None
    swapDataPaymentToken.path = []
  }

  const gasPrice = (await library?.getGasPrice()) ?? BigNumber.from(0)

  return {
    swapDataDebtCollateral,
    swapDataPaymentToken,
    inputTokenAmount,
    setTokenAmount,
    gasPrice,
  }
}

const getSwapDataCollateralDebt = async (
  leveragedTokenData: LeveragedTokenData,
  includedSources: string,
  chainId: ChainId = ChainId.Polygon
) => {
  let { swapData: swapDataDebtCollateral, zeroExQuote } = await getSwapData(
    {
      buyToken: leveragedTokenData.debtToken,
      sellToken: leveragedTokenData.collateralToken,
      sellAmount: leveragedTokenData.collateralAmount.toString(),
      includedSources,
    },
    chainId
  )
  const collateralObtained = BigNumber.from(zeroExQuote.buyAmount)
  return { swapDataDebtCollateral, collateralObtained }
}

const getSwapDataDebtCollateral = async (
  leveragedTokenData: LeveragedTokenData,
  includedSources: string,
  chainId: ChainId = ChainId.Polygon
) => {
  let { swapData: swapDataDebtCollateral, zeroExQuote } = await getSwapData(
    {
      buyToken: leveragedTokenData.collateralToken,
      sellToken: leveragedTokenData.debtToken,
      sellAmount: leveragedTokenData.debtAmount.toString(),
      includedSources,
    },
    chainId
  )
  const collateralObtained = BigNumber.from(zeroExQuote.buyAmount)
  return { swapDataDebtCollateral, collateralObtained }
}

const getSwapData = async (params: any, chainId: number = 137) => {
  // TODO: error handling (for INSUFFICIENT_ASSET_LIQUIDITY)
  const zeroExQuote = await get0xQuote(
    {
      ...params,
      slippagePercentage: 0.5,
    },
    chainId
  )

  // TODO: ?
  const swapData = {
    exchange: Exchange.Sushiswap,
    path: zeroExQuote.orders[0].fillData.tokenAddressPath,
    fees: [],
    pool: '0x0000000000000000000000000000000000000000',
  }

  return { swapData, zeroExQuote }
}
