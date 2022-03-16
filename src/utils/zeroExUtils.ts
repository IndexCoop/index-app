import axios from 'axios'
import querystring from 'querystring'

import { BigNumber } from '@ethersproject/bignumber'

import { POLYGON } from 'constants/chains'
import { DefiPulseIndex, ETH, Token } from 'constants/tokens'
import { toWei } from 'utils'

const API_GATED_URL = 'https://gated.api.0x.org/swap/v1/quote'
const API_GATED_URL_POLYGON = 'https://gated.polygon.api.0x.org/swap/v1/quote'

export type ZeroExData = {
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
}

const headers = {
  '0x-api-key': process.env.REACT_APP_0X_API_KEY,
}

function getApiUrl(query: string, chainId: number): string {
  let baseUrl = ''
  switch (chainId) {
    case POLYGON.chainId:
      baseUrl = API_GATED_URL_POLYGON
      break
    default:
      baseUrl = API_GATED_URL
  }

  return `${baseUrl}?${query}`
}

// Temporarily adding this because we need to support more tokens than the once
// we have defined as type Token in `tokens.ts`. Probably going to rewrite this
// into one function later.
export async function getQuote(params: any, chainId: number) {
  params.buyAmount = BigNumber.from(params.buyAmount).toString()
  const query = querystring.stringify(params)
  const url = getApiUrl(query, chainId)
  const response = await axios.get(url, { headers })
  return response.data
}

export const getZeroExTradeData = async (
  isExactInput: boolean,
  sellToken: Token,
  buyToken: Token,
  amount: string,
  chainId: number
): Promise<ZeroExData> => {
  const params = getApiParams(
    isExactInput,
    sellToken,
    buyToken,
    amount,
    chainId
  )

  const query = querystring.stringify(params)
  const url = getApiUrl(query, chainId)
  const resp = {
    data: {
      price: 'string',
      guaranteedPrice: '0',
      buyTokenAddress: DefiPulseIndex.address || '',
      sellTokenAddress: ETH.address || '',
      buyAmount: '1',
      sellAmount: '1',
      to: 'string',
      from: 'string',
      sources: [{ name: 'yo mama', proportion: '1' }],
      displayBuyAmount: 9,
      displaySellAmount: 9,
      minOutput: BigNumber.from(0),
      maxInput: BigNumber.from(0),
      gas: '1',
      gasPrice: '1',
      formattedSources: 'string',
      buyTokenCost: '1',
      sellTokenCost: '1',
    },
  } //await axios.get(url, { headers })
  const zeroExData: ZeroExData = resp.data

  return await processApiResult(
    zeroExData,
    isExactInput,
    sellToken,
    buyToken,
    amount,
    chainId
  )
}

const getChainTokenAddress = (token: Token, chainId: number) => {
  if (chainId === POLYGON.chainId)
    return token.symbol === 'MATIC' ? 'MATIC' : token.polygonAddress
  return token.symbol === 'ETH' ? 'ETH' : token.address
}

const getApiParams = (
  isExactInput: boolean,
  sellToken: Token,
  buyToken: Token,
  buySellAmount: string,
  chainId: number
): any => {
  let params: any
  params = {
    sellToken: getChainTokenAddress(sellToken, chainId),
    buyToken: getChainTokenAddress(buyToken, chainId),
  }
  if (isExactInput) {
    params.sellAmount = getDecimalAdjustedAmount(
      buySellAmount,
      sellToken.decimals
    )
  } else {
    params.buyAmount = getDecimalAdjustedAmount(
      buySellAmount,
      buyToken.decimals
    )
  }

  return params
}

// Adds some additional information to the ZeroExData return object. This extra information is only used for display purposes, and
// will have no effect on the outcome of the transaction
const processApiResult = async (
  zeroExData: ZeroExData,
  isExactInput: boolean,
  sellToken: Token,
  buyToken: Token,
  amount: string,
  chainId: number
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

  // Not used right now - and an issue as it would cause too many fetches from EI
  // const buyTokenPrice = await fetchCoingeckoTokenPrice(
  //   zeroExData.buyTokenAddress,
  //   chainId
  // )
  // zeroExData.buyTokenCost = (
  //   buyTokenPrice * zeroExData.displayBuyAmount
  // ).toFixed(2)
  //
  // const sellTokenPrice: number = await fetchCoingeckoTokenPrice(
  //   zeroExData.sellTokenAddress,
  //   chainId
  // )
  // zeroExData.sellTokenCost = (
  //   sellTokenPrice * zeroExData.displaySellAmount
  // ).toFixed(2)

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
  return BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals)).toString()
}
