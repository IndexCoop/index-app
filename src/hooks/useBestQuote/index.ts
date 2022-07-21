import { useState } from 'react'

import { useNetwork } from 'wagmi'

import { BigNumber } from '@ethersproject/bignumber'
import { SwapData, ZeroExApi } from '@indexcoop/index-exchange-issuance-sdk'

import { IndexApiBaseUrl } from 'constants/server'
import { Token } from 'constants/tokens'
import { useBalances } from 'hooks/useBalance'
import { toWei } from 'utils'
import { getFullCostsInUsd } from 'utils/exchangeIssuanceQuotes'
import { GasStation } from 'utils/gasStation'
import { getAddressForToken } from 'utils/tokens'
import {
  getNetworkKey,
  getZeroExTradeData,
  ZeroExData,
} from 'utils/zeroExUtils'

import { useWallet } from '../useWallet'

import { getEILeveragedQuote } from './exchangeIssuanceLeveraged'
import { getEIZeroExQuote } from './exchangeIssuanceZeroEx'

export enum QuoteType {
  notAvailable = 'notAvailable',
  exchangeIssuanceLeveraged = 'exchangeIssuanceLeveraged',
  exchangeIssuanceZeroEx = 'exchangeIssuanceZeroEx',
  zeroEx = 'zeroEx',
}

interface Quote {
  type: QuoteType
  isIssuance: boolean
  inputToken: Token
  outputToken: Token
  gas: BigNumber
  gasPrice: BigNumber
  gasCosts: BigNumber
  fullCostsInUsd: number | null
  priceImpact: number
  setTokenAmount: BigNumber
  inputOutputTokenAmount: BigNumber
}

export interface ExchangeIssuanceLeveragedQuote extends Quote {
  swapDataDebtCollateral: SwapData
  swapDataPaymentToken: SwapData
}

export interface ExchangeIssuanceZeroExQuote extends Quote {
  componentQuotes: string[]
}

export interface ZeroExQuote extends Quote {
  chainId: string
  data: string
  minOutput: BigNumber
  sources: { name: string; proportion: string }[]
  to: string
  value: string
}

type QuoteResult = {
  bestQuote: QuoteType
  error: Error | null
  quotes: {
    exchangeIssuanceLeveraged: ExchangeIssuanceLeveragedQuote | null
    exchangeIssuanceZeroEx: ExchangeIssuanceZeroExQuote | null
    zeroEx: ZeroExQuote | null
  }
  success: boolean
}

// To determine if price impact for DEX is smaller 5%
export const maxPriceImpact = 5

export function getBestQuote(
  fullCosts0x: number | null,
  fullCostsEI: number | null,
  fullCostsLevEI: number | null,
  priceImpactDex: number
): QuoteType {
  if (fullCostsEI === null && fullCostsLevEI === null) {
    return QuoteType.zeroEx
  }

  const quotes: any[][] = []
  if (fullCosts0x) {
    quotes.push([QuoteType.zeroEx, fullCosts0x])
  }
  if (fullCostsEI) {
    quotes.push([QuoteType.exchangeIssuanceZeroEx, fullCostsEI])
  }
  if (fullCostsLevEI) {
    quotes.push([QuoteType.exchangeIssuanceLeveraged, fullCostsLevEI])
  }
  const cheapestQuotes = quotes.sort((q1, q2) => q1[1] - q2[1])

  if (cheapestQuotes.length <= 0) {
    return QuoteType.zeroEx
  }

  const cheapestQuote = cheapestQuotes[0]
  const bestOption = cheapestQuote[0]

  // If only one quote, return best option immediately
  if (cheapestQuotes.length === 1) {
    return bestOption
  }

  // If multiple quotes, check price impact of 0x option
  if (bestOption === QuoteType.zeroEx && priceImpactDex >= maxPriceImpact) {
    // In case price impact is too high, return cheapest exchange issuance
    return cheapestQuotes[1][0]
  }

  return bestOption
}

export const getSetTokenAmount = (
  isIssuance: boolean,
  sellTokenAmount: string,
  sellTokenDecimals: number,
  sellTokenPrice: number,
  buyTokenPrice: number,
  dexSwapOption: ZeroExData | null
): BigNumber => {
  if (!isIssuance) {
    return toWei(sellTokenAmount, sellTokenDecimals)
  }

  let setTokenAmount = BigNumber.from(dexSwapOption?.buyAmount ?? '0')

  const priceImpact =
    dexSwapOption && dexSwapOption.estimatedPriceImpact
      ? parseFloat(dexSwapOption.estimatedPriceImpact)
      : 0

  if (!dexSwapOption || priceImpact >= maxPriceImpact) {
    // Recalculate the exchange issue/redeem quotes if not enough DEX liquidity
    const sellTokenTotal = parseFloat(sellTokenAmount) * sellTokenPrice
    const approxOutputAmount =
      buyTokenPrice === 0 ? 0 : Math.floor(sellTokenTotal / buyTokenPrice)
    setTokenAmount = toWei(approxOutputAmount, sellTokenDecimals)
  }

  return setTokenAmount
}

const defaultQuoteResult: QuoteResult = {
  bestQuote: QuoteType.notAvailable,
  error: null,
  quotes: {
    exchangeIssuanceLeveraged: null,
    exchangeIssuanceZeroEx: null,
    zeroEx: null,
  },
  success: false,
}

export const useBestQuote = () => {
  const { provider, signer } = useWallet()
  const { chain } = useNetwork()
  const { getBalance } = useBalances()
  const chainId = chain?.id

  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [quoteResult, setQuoteResult] =
    useState<QuoteResult>(defaultQuoteResult)

  /**
   *
   * @param slippage   The max acceptable slippage, e.g. 3 for 3 %
   */
  const fetchAndCompareOptions = async (
    sellToken: Token,
    sellTokenAmount: string,
    sellTokenPrice: number,
    buyToken: Token,
    // buyTokenAmount: string,
    buyTokenPrice: number,
    nativeTokenPrice: number,
    isIssuance: boolean,
    slippage: number
  ) => {
    const inputTokenAddress = getAddressForToken(sellToken, chainId)
    const outputTokenAddress = getAddressForToken(buyToken, chainId)

    if (!provider || !chainId) {
      console.error('Error - no provider or chain id present')
      return
    }

    if (!inputTokenAddress || !outputTokenAddress) {
      console.log(inputTokenAddress, outputTokenAddress)
      console.error('Error can not determine input/ouput token address')
      return
    }

    setIsFetching(true)

    const slippagePercentage = slippage / 100
    /* Check 0x for DEX Swap option*/
    const zeroExResult = await getZeroExTradeData(
      // for now we only allow selling
      true,
      sellToken,
      buyToken,
      // for now we only allow specifing selling amount,
      // so sell token amount will always be correct
      sellTokenAmount,
      slippagePercentage,
      chainId
    )
    const dexSwapOption = zeroExResult.success ? zeroExResult.value : null
    const dexSwapError = zeroExResult.success ? null : zeroExResult.error
    const gasLimit0x = BigNumber.from(dexSwapOption?.gas ?? '0')
    const gasPrice0x = BigNumber.from(dexSwapOption?.gasPrice ?? '0')
    const gas0x = gasPrice0x.mul(gasLimit0x)
    const sellTokenAmountInWei = toWei(sellTokenAmount, sellToken.decimals)
    const zeroExQuote: ZeroExQuote | null = dexSwapOption
      ? {
          type: QuoteType.zeroEx,
          isIssuance,
          inputToken: sellToken,
          outputToken: buyToken,
          gas: gasLimit0x,
          gasPrice: gasPrice0x,
          gasCosts: gas0x,
          fullCostsInUsd: getFullCostsInUsd(
            toWei(sellTokenAmount, sellToken.decimals),
            gas0x,
            sellToken.decimals,
            sellTokenPrice,
            nativeTokenPrice
          ),
          priceImpact: parseFloat(dexSwapOption.estimatedPriceImpact ?? '5'),
          setTokenAmount: isIssuance
            ? BigNumber.from(dexSwapOption.buyAmount)
            : sellTokenAmountInWei,
          inputOutputTokenAmount: isIssuance
            ? sellTokenAmountInWei
            : BigNumber.from(dexSwapOption.buyAmount),
          // type specific properties
          chainId: dexSwapOption.chainId,
          data: dexSwapOption.data,
          minOutput: dexSwapOption.minOutput,
          sources: dexSwapOption.sources,
          to: dexSwapOption.to,
          value: dexSwapOption.value,
        }
      : null

    /* Determine Set token amount based on different factors */
    let setTokenAmount = getSetTokenAmount(
      isIssuance,
      sellTokenAmount,
      sellToken.decimals,
      sellTokenPrice,
      buyTokenPrice,
      dexSwapOption
    )

    const gasStation = new GasStation(provider)
    const gasPrice = await gasStation.getGasPrice()

    // Create an instance of ZeroExApi (to pass to quote functions)
    const affilliateAddress = '0x37e6365d4f6aE378467b0e24c9065Ce5f06D70bF'
    const networkKey = getNetworkKey(chainId)
    const swapPathOverride = `/${networkKey}/swap/v1/quote`
    const zeroExApi = new ZeroExApi(
      `${IndexApiBaseUrl}/0x`,
      affilliateAddress,
      swapPathOverride
    )

    const exchangeIssuanceLeveragedQuote: ExchangeIssuanceLeveragedQuote | null =
      await getEILeveragedQuote(
        isIssuance,
        inputTokenAddress,
        outputTokenAddress,
        sellToken,
        buyToken,
        setTokenAmount,
        sellTokenPrice,
        nativeTokenPrice,
        gasPrice,
        slippage,
        chainId,
        provider,
        zeroExApi
      )

    const inputTokenBalance = getBalance(sellToken.symbol) ?? BigNumber.from(0)
    const exchangeIssuanceZeroExQuote: ExchangeIssuanceZeroExQuote | null =
      await getEIZeroExQuote(
        isIssuance,
        inputTokenAddress,
        outputTokenAddress,
        inputTokenBalance,
        sellToken,
        buyToken,
        setTokenAmount,
        sellTokenPrice,
        nativeTokenPrice,
        gasPrice,
        slippage,
        chainId,
        provider,
        zeroExApi,
        signer
      )

    console.log('////////')
    console.log('exchangeIssuanceZeroExQuote', exchangeIssuanceZeroExQuote)
    console.log(
      'exchangeIssuanceLeveragedQuote',
      exchangeIssuanceLeveragedQuote
    )

    const success =
      exchangeIssuanceLeveragedQuote !== null ||
      exchangeIssuanceZeroExQuote !== null ||
      zeroExQuote !== null

    console.log(
      zeroExQuote?.fullCostsInUsd ?? null,
      exchangeIssuanceZeroExQuote?.fullCostsInUsd ?? null,
      exchangeIssuanceLeveragedQuote?.fullCostsInUsd ?? null,
      'FC'
    )

    const bestQuote = getBestQuote(
      zeroExQuote?.fullCostsInUsd ?? null,
      exchangeIssuanceZeroExQuote?.fullCostsInUsd ?? null,
      exchangeIssuanceLeveragedQuote?.fullCostsInUsd ?? null,
      zeroExQuote?.priceImpact ?? 5
    )

    console.log('success', success, bestQuote)

    const quoteResult: QuoteResult = {
      success,
      error: dexSwapError,
      bestQuote,
      quotes: {
        exchangeIssuanceLeveraged: exchangeIssuanceLeveragedQuote,
        exchangeIssuanceZeroEx: exchangeIssuanceZeroExQuote,
        zeroEx: zeroExQuote,
      },
    }

    setQuoteResult(quoteResult)
    setIsFetching(false)
  }

  return {
    fetchAndCompareOptions,
    isFetchingTradeData: isFetching,
    quoteResult,
  }
}
