import { BigNumber, ethers } from 'ethers'

import { ChainId } from '@usedapp/core'

import {
  collateralDebtSwapData,
  debtCollateralSwapData,
  inputSwapData,
  outputSwapData,
} from 'constants/exchangeIssuanceLeveragedData'
import { ETH, Token } from 'constants/tokens'
import {
  getExchangeIssuanceLeveragedContract,
  getLeveragedTokenData,
} from 'hooks/useExchangeIssuanceLeveraged'
import {
  getRequiredIssuanceComponents,
  getRequiredRedemptionComponents,
} from 'hooks/useExchangeIssuanceZeroEx'
import { toWei } from 'utils'
import { getIssuanceModule } from 'utils/issuanceModule'
import {
  getSwapData,
  getSwapDataCollateralDebt,
  getSwapDataDebtCollateral,
} from 'utils/swapData'
import { get0xQuote } from 'utils/zeroExUtils'

// Slippage hard coded to .5% (will be increased if there are revert issues)
export const slippagePercentage = 0.5

export enum Exchange {
  None,
  Quickswap,
  Sushiswap,
  UniV3,
  Curve,
}

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

export interface LeveragedTokenData {
  collateralAToken: string
  collateralToken: string
  debtToken: string
  collateralAmount: BigNumber
  debtAmount: BigNumber
}

export interface SwapData {
  exchange: Exchange
  path: string[]
  fees: number[]
  pool: string
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
  // 0xAPI expects percentage as value between 0-1 e.g. 5% -> 0.05
  const slippage = slippagePercentage / 100

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
          slippagePercentage: slippage,
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
    .div(toWei(100 - slippagePercentage, sellToken.decimals))

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
  const curve = get0xEchangeKey(Exchange.Curve)
  const sushi = get0xEchangeKey(Exchange.Sushiswap)
  let includedSources: string = isIcEth
    ? [curve].toString()
    : [sushi].toString()

  console.log('isIssuance', isIssuance)
  let debtCollateralResult = isIssuance
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

  if (!debtCollateralResult) return null
  let { swapDataDebtCollateral, collateralObtainedOrSold } =
    debtCollateralResult

  console.log('collateralObtained', collateralObtainedOrSold.toString())
  const collateralShortfall = leveragedTokenData.collateralAmount.sub(
    collateralObtainedOrSold
  )
  const leftoverCollateral = leveragedTokenData.collateralAmount.sub(
    collateralObtainedOrSold
  )

  console.log(
    '->',
    leveragedTokenData.collateralAmount.toString(),
    collateralObtainedOrSold.toString(),
    leftoverCollateral.toString()
  )

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

  if (isIcEth) {
    // just using the static versions
    swapDataDebtCollateral = isIssuance
      ? debtCollateralSwapData[tokenSymbol]
      : collateralDebtSwapData[tokenSymbol]

    if (!isIssuance) {
      // TODO: should this always be the collateralToken?
      // paymentTokenAddress = leveragedTokenData.collateralToken
      paymentTokenAddress = '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84' // stETH
    }
  }

  console.log(
    'isSame',
    paymentTokenAddress?.toLowerCase() ===
      leveragedTokenData.collateralToken.toLowerCase()
  )

  const issuanceParams = {
    buyToken: leveragedTokenData.collateralToken,
    buyAmount: collateralShortfall.toString(),
    sellToken: paymentTokenAddress,
    includedSources,
  }

  const redeemingParams = {
    buyToken: paymentTokenAddress,
    sellAmount: leftoverCollateral.toString(),
    sellToken: leveragedTokenData.collateralToken,
    includedSources,
  }

  // By default the input/output swap data can be empty (as it will be ignored)
  let swapDataPaymentToken: SwapData = {
    exchange: Exchange.None,
    path: [],
    fees: [],
    pool: '0x0000000000000000000000000000000000000000',
  }
  // Default if collateral token should be equal to payment token
  let paymentTokenAmount = isIssuance ? collateralShortfall : leftoverCollateral

  // Only fetch input/output swap data if collateral token is not the same as payment token
  if (leveragedTokenData.collateralToken !== paymentTokenAddress) {
    const result = await getSwapData(
      isIssuance ? issuanceParams : redeemingParams,
      chainId
    )
    if (result) {
      const { swapData, zeroExQuote } = result
      swapDataPaymentToken = swapData
      paymentTokenAmount = isIssuance
        ? BigNumber.from(zeroExQuote.sellAmount)
        : BigNumber.from(zeroExQuote.buyAmount)
    }
  }

  if (isIcEth) {
    // just use the static versions here
    swapDataPaymentToken = isIssuance
      ? inputSwapData[tokenSymbol][ETH.symbol]
      : outputSwapData[tokenSymbol][ETH.symbol]
  }

  const gasPrice = (await library?.getGasPrice()) ?? BigNumber.from(0)

  console.log('swapDataDebtCollateral', swapDataDebtCollateral)
  console.log('swapDataPaymentToken', swapDataPaymentToken)
  console.log('inputTokenAmount', paymentTokenAmount.toString())
  return {
    swapDataDebtCollateral,
    swapDataPaymentToken,
    inputTokenAmount: paymentTokenAmount,
    setTokenAmount,
    gasPrice,
  }
}
