import { BigNumber, ethers } from 'ethers'

import { ChainId } from '@usedapp/core'

import {
  collateralDebtSwapData,
  debtCollateralSwapData,
  inputSwapData,
  outputSwapData,
} from 'constants/exchangeIssuanceLeveragedData'
import { ETH, icETHIndex, JPGIndex, MATIC, Token, WETH } from 'constants/tokens'
import {
  getExchangeIssuanceLeveragedContract,
  getLeveragedTokenData,
} from 'hooks/useExchangeIssuanceLeveraged'
import {
  getExchangeIssuanceZeroExContract,
  getRequiredIssuanceComponents,
  getRequiredRedemptionComponents,
} from 'hooks/useExchangeIssuanceZeroEx'
import { toWei } from 'utils'
import { getExchangeIssuanceGasEstimate } from 'utils/exchangeIssuanceGasEstimate'
import { getIssuanceModule } from 'utils/issuanceModule'
import {
  getSwapData,
  getSwapDataCollateralDebt,
  getSwapDataDebtCollateral,
} from 'utils/swapData'
import { getAddressForToken } from 'utils/tokens'
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
  setTokenAmount: BigNumber
  gas: BigNumber
  gasPrice: BigNumber
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

export async function getRequiredComponents(
  isIssuance: boolean,
  setToken: string | undefined,
  setTokenSymbol: string,
  setTokenAmount: BigNumber,
  chainId: ChainId | undefined,
  signer: ethers.Signer | undefined
) {
  const issuanceModule = getIssuanceModule(setTokenSymbol, chainId)

  const contract = await getExchangeIssuanceZeroExContract(
    signer,
    chainId ?? ChainId.Mainnet
  )

  const { components, positions } = isIssuance
    ? await getRequiredIssuanceComponents(
        contract,
        issuanceModule.address,
        issuanceModule.isDebtIssuance,
        setToken ?? '',
        setTokenAmount
      )
    : await getRequiredRedemptionComponents(
        contract,
        issuanceModule.address,
        issuanceModule.isDebtIssuance,
        setToken ?? '',
        setTokenAmount
      )

  return { components, positions }
}

/**
 * Returns exchange issuance quotes (incl. 0x trade data) or null
 *
 * @param buyToken            The token to buy
 * @param setTokenAmount      The amount of set token that should be acquired/sold
 * @param sellToken           The token to sell
 * @param chainId             ID for current chain
 * @param library             Web3Provider instance
 *
 * @return tradeData           Array of 0x trade data for the individual positions
 * @return inputTokenAmount    Needed input token amount for trade
 */
export const getExchangeIssuanceQuotes = async (
  buyToken: Token,
  setTokenAmount: BigNumber,
  sellToken: Token,
  isIssuance: boolean,
  chainId: ChainId = ChainId.Mainnet,
  library: ethers.providers.Web3Provider | undefined
): Promise<ExchangeIssuanceQuote | null> => {
  const isPolygon = chainId === ChainId.Polygon
  const buyTokenAddress = isPolygon ? buyToken.polygonAddress : buyToken.address
  const sellTokenAddress = isPolygon
    ? sellToken.polygonAddress
    : sellToken.address
  const wethAddress = isPolygon ? WETH.polygonAddress : WETH.address

  const setTokenAddress = isIssuance ? buyTokenAddress : sellTokenAddress
  const setTokenSymbol = isIssuance ? buyToken.symbol : sellToken.symbol

  const { components, positions } = await getRequiredComponents(
    isIssuance,
    setTokenAddress,
    setTokenSymbol,
    setTokenAmount,
    chainId,
    library?.getSigner()
  )

  let positionQuotes: string[] = []
  // Input for issuing / output for redeeming
  let inputOutputTokenAmount = BigNumber.from(0)
  // TODO: do we wannt .5% or 5% slippage?
  // 0xAPI expects percentage as value between 0-1 e.g. 5% -> 0.05
  const isJPG = setTokenSymbol === JPGIndex.symbol
  const slippage = isJPG ? 0.08 : slippagePercentage / 100

  const quotePromises: Promise<any>[] = []
  components.forEach((component, index) => {
    const sellAmount = positions[index]
    const buyAmount = positions[index]
    // TODO: check again if .address is correcct
    const buyTokenAddress = isIssuance
      ? component
      : buyToken.symbol === 'ETH'
      ? wethAddress
      : buyToken.address
    const sellTokenAddress = isIssuance
      ? sellToken.symbol === 'ETH'
        ? wethAddress
        : sellToken.address
      : component

    if (buyTokenAddress === sellTokenAddress) {
      inputOutputTokenAmount = isIssuance
        ? inputOutputTokenAmount.add(buyAmount)
        : inputOutputTokenAmount.add(sellAmount)
    } else {
      const quotePromise = isIssuance
        ? get0xQuote(
            {
              buyToken: buyTokenAddress,
              sellToken: sellTokenAddress,
              buyAmount: buyAmount.toString(),
              slippagePercentage: slippage,
            },
            chainId ?? 1
          )
        : get0xQuote(
            {
              buyToken: buyTokenAddress,
              sellToken: sellTokenAddress,
              sellAmount: sellAmount.toString(),
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
  inputOutputTokenAmount = results
    .map((result) =>
      BigNumber.from(isIssuance ? result.sellAmount : result.buyAmount)
    )
    .reduce((prevValue, currValue) => {
      return currValue.add(prevValue)
    })

  // Christn: I assume that this is the correct math to make sure we have enough weth to cover the slippage
  // based on the fact that the slippagePercentage is limited between 0.0 and 1.0 on the 0xApi
  inputOutputTokenAmount = inputOutputTokenAmount
    .mul(toWei(100, isIssuance ? sellToken.decimals : buyToken.decimals))
    .div(
      toWei(
        100 - slippagePercentage,
        isIssuance ? sellToken.decimals : buyToken.decimals
      )
    )

  const gasPrice = (await library?.getGasPrice()) ?? BigNumber.from(1800000)

  // TODO: get balance and check if inputAmount exceeds balance
  // TODO: only fetch gasEstimate if inputAmount <= balance
  // TODO: otherwise skip, to still return a quote
  const gasEstimate = await getExchangeIssuanceGasEstimate(
    library,
    chainId,
    isIssuance,
    sellToken,
    buyToken,
    setTokenAmount,
    inputOutputTokenAmount,
    positionQuotes
  )

  return {
    tradeData: positionQuotes,
    inputTokenAmount: inputOutputTokenAmount,
    setTokenAmount,
    gas: gasEstimate,
    gasPrice,
  }
}

// Returns a comma separated string of sources to be included for 0x API calls
export function getIncloudedSources(isIcEth: boolean): string {
  // TODO: multi sources?
  //TODO: Allow Quickswap and UniV3
  const curve = get0xEchangeKey(Exchange.Curve)
  const sushi = get0xEchangeKey(Exchange.Sushiswap)
  let includedSources: string = isIcEth
    ? [curve].toString()
    : [sushi].toString()
  return includedSources
}

async function getLevTokenData(
  setToken: Token,
  setTokenAmount: BigNumber,
  isIssuance: boolean,
  chainId: number,
  signer: ethers.providers.JsonRpcSigner | undefined
): Promise<LeveragedTokenData> {
  const contract = await getExchangeIssuanceLeveragedContract(signer, chainId)
  const setTokenAddress = getAddressForToken(setToken, chainId)
  return await getLeveragedTokenData(
    contract,
    setTokenAddress ?? '',
    setTokenAmount,
    isIssuance
  )
}

export function getLevEIPaymentTokenAddress(
  paymentToken: Token,
  isIssuance: boolean,
  chainId: number
): string {
  if (paymentToken.symbol === ETH.symbol) {
    return 'ETH'
  }

  if (paymentToken.symbol === icETHIndex.symbol && !isIssuance) {
    // TODO: should this always be the collateralToken?
    // paymentTokenAddress = leveragedTokenData.collateralToken
    return '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84' // stETH
  }

  if (chainId === ChainId.Polygon && paymentToken.symbol === MATIC.symbol) {
    const WMATIC_ADDRESS = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
    return WMATIC_ADDRESS
  }

  const paymentTokenAddress = getAddressForToken(paymentToken, chainId)
  return paymentTokenAddress ?? ''
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
  const includedSources = getIncloudedSources(isIcEth)

  const leveragedTokenData = await getLevTokenData(
    setToken,
    setTokenAmount,
    isIssuance,
    chainId,
    library?.getSigner()
  )

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

  const collateralShortfall = leveragedTokenData.collateralAmount.sub(
    collateralObtainedOrSold
  )
  const leftoverCollateral = leveragedTokenData.collateralAmount.sub(
    collateralObtainedOrSold
  )

  let paymentTokenAddress = getLevEIPaymentTokenAddress(
    paymentToken,
    isIssuance,
    chainId
  )

  if (isIcEth) {
    // just using the static versions
    swapDataDebtCollateral = isIssuance
      ? debtCollateralSwapData[tokenSymbol]
      : collateralDebtSwapData[tokenSymbol]
  }

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

  return {
    swapDataDebtCollateral,
    swapDataPaymentToken,
    inputTokenAmount: paymentTokenAmount,
    setTokenAmount,
    gasPrice,
  }
}
