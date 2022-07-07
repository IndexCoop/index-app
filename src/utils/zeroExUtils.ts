import axios from 'axios'

import { BigNumber } from '@ethersproject/bignumber'

import { OPTIMISM, POLYGON } from 'constants/chains'
import { IndexApiBaseUrl } from 'constants/server'
import { Token } from 'constants/tokens'
import { toWei } from 'utils'

const API_0X_INDEX_URL = `${IndexApiBaseUrl}/0x`

type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E }

export type ZeroExData = {
  chainId: string
  data: string
  estimatedPriceImpact: string
  price: string
  guaranteedPrice: string
  buyTokenAddress: string
  sellTokenAddress: string
  buyAmount: string
  sellAmount: string
  to: string
  from: string
  sources: { name: string; proportion: string }[]
  displayBuyAmount: number
  displaySellAmount: number
  minOutput: BigNumber
  maxInput: BigNumber
  gas: string | undefined
  gasPrice: string
  formattedSources: string
  buyTokenCost: string
  sellTokenCost: string
  value: string
}

export function getNetworkKey(chainId: number): string {
  switch (chainId) {
    case POLYGON.chainId:
      return 'polygon'
    case OPTIMISM.chainId:
      return 'optimism'
    default:
      return 'mainnet'
  }
}

function getApiUrl(query: string, chainId: number): string {
  const quotePath = '/swap/v1/quote'
  const networkKey = getNetworkKey(chainId)
  // example: https://api.indexcoop.com/0x/mainnet/swap/v1/quote?sellToken=ETH&buyToken=0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b&sellAmount=10000000000000000000&affilliateAddress=0x37e6365d4f6aE378467b0e24c9065Ce5f06D70bF
  return `${API_0X_INDEX_URL}/${networkKey}${quotePath}?${query}&affilliateAddress=0x37e6365d4f6aE378467b0e24c9065Ce5f06D70bF`
}

/**
 *
 * @param slippagePercentage  The maximum acceptable slippage buy/sell amount. Slippage percentage: 0.03 for 3% slippage allowed.
 */
export const getZeroExTradeData = async (
  isExactInput: boolean,
  sellToken: Token,
  buyToken: Token,
  amount: string,
  slippagePercentage: number,
  chainId: number,
  rawData: boolean = false
): Promise<Result<ZeroExData, Error>> => {
  let params = getApiParamsForTokens(
    isExactInput,
    sellToken,
    buyToken,
    amount,
    chainId
  )
  params.slippagePercentage = slippagePercentage

  const query = new URLSearchParams(params).toString()
  const url = getApiUrl(query, chainId)
  console.log('0x', url)
  try {
    const resp = await axios.get(url)
    const zeroExData: ZeroExData = resp.data
    const apiResult = rawData
      ? resp.data
      : await processApiResult(
          zeroExData,
          isExactInput,
          sellToken,
          buyToken,
          amount
        )
    return { success: true, value: apiResult }
  } catch (e: any) {
    if (
      e.response.status === 400 &&
      e.response.data.validationErrors[0].reason ===
        'INSUFFICIENT_ASSET_LIQUIDITY'
    ) {
      return {
        success: false,
        error: new Error('Insufficient Asset Liquidity'),
      }
    }
    return { success: false, error: new Error('Error retrieving 0x API data') }
  }
}

export const get0xApiParams = (
  isExactInput: boolean,
  sellToken: string,
  sellTokenDecimals: number,
  buyToken: string,
  buyTokenDecimals: number,
  buySellAmount: string
): any => {
  let params: any
  params = {
    sellToken,
    buyToken,
  }

  if (isExactInput) {
    params.sellAmount = getDecimalAdjustedAmount(
      buySellAmount,
      sellTokenDecimals
    )
  } else {
    params.buyAmount = getDecimalAdjustedAmount(buySellAmount, buyTokenDecimals)
  }

  return params
}

const getChainTokenAddress = (token: Token, chainId: number) => {
  if (chainId === POLYGON.chainId)
    return token.symbol === 'MATIC' ? 'MATIC' : token.polygonAddress
  if (chainId === OPTIMISM.chainId)
    return token.symbol === 'ETH' ? 'ETH' : token.optimismAddress
  return token.symbol === 'ETH' ? 'ETH' : token.address
}

/* Convenience function for Token's */
const getApiParamsForTokens = (
  isExactInput: boolean,
  sellToken: Token,
  buyToken: Token,
  buySellAmount: string,
  chainId: number
): any => {
  return get0xApiParams(
    isExactInput,
    getChainTokenAddress(sellToken, chainId) ?? '',
    sellToken.decimals,
    getChainTokenAddress(buyToken, chainId) ?? '',
    buyToken.decimals,
    buySellAmount
  )
}

// Adds some additional information to the ZeroExData return object. This extra information is only used for display purposes, and
// will have no effect on the outcome of the transaction
const processApiResult = async (
  zeroExData: ZeroExData,
  isExactInput: boolean,
  sellToken: Token,
  buyToken: Token,
  amount: string
): Promise<ZeroExData> => {
  zeroExData.displaySellAmount = getDisplayAdjustedAmount(
    zeroExData.sellAmount,
    sellToken.decimals
  )
  zeroExData.displayBuyAmount = getDisplayAdjustedAmount(
    zeroExData.buyAmount,
    buyToken.decimals
  )

  const amountInWei = toWei(
    amount,
    isExactInput ? sellToken.decimals : buyToken.decimals
  )
  const priceInWei = toWei(zeroExData.guaranteedPrice)
  const guaranteedPrice = BigNumber.from(priceInWei)
  zeroExData.minOutput = isExactInput
    ? guaranteedPrice
        .mul(BigNumber.from(zeroExData.sellAmount))
        .div(BigNumber.from(10).pow(sellToken.decimals))
    : BigNumber.from(amountInWei)
  zeroExData.maxInput = isExactInput
    ? BigNumber.from(amountInWei)
    : guaranteedPrice
        .mul(BigNumber.from(zeroExData.buyAmount))
        .div(BigNumber.from(10).pow(buyToken.decimals))

  zeroExData.formattedSources = formatSources(zeroExData.sources)

  return zeroExData
}

export const getDisplayAdjustedAmount = (
  amount: string,
  decimals: number
): number => {
  const e18 = BigNumber.from(10).pow(decimals)
  return BigNumber.from(amount).div(e18).toNumber()
}

const formatSources = (
  sources: { name: string; proportion: string }[]
): string => {
  const activeSources: any[] = []

  sources.forEach((source: any) => {
    if (source.proportion !== '0') activeSources.push(source)
  })
  const sourceNames: string[] = activeSources.map((source) =>
    source.name.replaceAll('_', ' ')
  )

  return sourceNames.length === 1
    ? sourceNames[0]
    : sourceNames.slice(0, -1).join(', ') + ' and ' + sourceNames.slice(-1)
}

const getDecimalAdjustedAmount = (amount: string, decimals: number): string => {
  const amountInWei = toWei(amount, decimals)
  return amountInWei.toString()
}
