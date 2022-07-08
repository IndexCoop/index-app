import { useState } from 'react'

import { useNetwork } from 'wagmi'

import { BigNumber } from '@ethersproject/bignumber'
import {
  getExchangeIssuanceLeveragedQuote,
  getExchangeIssuanceZeroExQuote,
  SwapData,
  ZeroExApi,
} from '@indexcoop/index-exchange-issuance-sdk'

import { MAINNET } from 'constants/chains'
import { IndexApiBaseUrl } from 'constants/server'
import {
  eligibleLeveragedExchangeIssuanceTokens,
  ETH,
  icETHIndex,
  IndexToken,
  JPGIndex,
  STETH,
  Token,
} from 'constants/tokens'
import { useBalances } from 'hooks/useBalance'
import { toWei } from 'utils'
import { getExchangeIssuanceGasEstimate } from 'utils/exchangeIssuanceGasEstimate'
import { getFullCostsInUsd } from 'utils/exchangeIssuanceQuotes'
import { GasStation } from 'utils/gasStation'
import { getAddressForToken } from 'utils/tokens'
import {
  getNetworkKey,
  getZeroExTradeData,
  ZeroExData,
} from 'utils/zeroExUtils'

import { useWallet } from './useWallet'

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

interface ExchangeIssuanceLeveragedQuote extends Quote {
  swapDataDebtCollateral: SwapData
  swapDataPaymentToken: SwapData
}

interface ExchangeIssuanceZeroExQuote extends Quote {
  componentQuotes: string[]
}

interface ZeroExQuote extends Quote {
  minOutput: BigNumber
  sources: { name: string; proportion: string }[]
}

type QuoteResult = {
  bestQuote: QuoteType
  quotes: {
    exchangeIssuanceLeveraged: ExchangeIssuanceLeveragedQuote | null
    exchangeIssuanceZeroEx: ExchangeIssuanceZeroExQuote | null
    zeroEx: ZeroExQuote | null
  }
  success: boolean
}

export interface ExchangeIssuanceQuote {
  tradeData: string[]
  inputTokenAmount: BigNumber
  setTokenAmount: BigNumber
  gas: BigNumber
}

export type LeveragedExchangeIssuanceQuote = {
  swapDataDebtCollateral: SwapData
  swapDataPaymentToken: SwapData
  inputTokenAmount: BigNumber
  setTokenAmount: BigNumber
}

type Result<_, E = Error> =
  | {
      success: true
      dexData: ZeroExData | null
      exchangeIssuanceData: ExchangeIssuanceQuote | null | undefined
      leveragedExchangeIssuanceData: LeveragedExchangeIssuanceQuote | null
    }
  | { success: false; error: E }

// To determine if price impact for DEX is smaller 5%
export const maxPriceImpact = 5

/* Determines if the token is eligible for Leveraged Exchange Issuance */
const isEligibleLeveragedToken = (token: Token) =>
  eligibleLeveragedExchangeIssuanceTokens.includes(token)

export function isEligibleTradePairZeroEx(
  inputToken: Token,
  outputToken: Token
): boolean {
  if (
    inputToken.symbol === icETHIndex.symbol ||
    outputToken.symbol === icETHIndex.symbol
  )
    return false

  if (
    inputToken.symbol === IndexToken.symbol ||
    outputToken.symbol === IndexToken.symbol
  )
    return false

  if (
    inputToken.symbol === JPGIndex.symbol ||
    outputToken.symbol === JPGIndex.symbol
  )
    // temporarily - disabled JPG for EI0x
    return false

  return true
}

/* Determines if the token pair is eligible for Leveraged Exchange Issuance */
export const isEligibleTradePair = (
  inputToken: Token,
  outputToken: Token,
  isIssuance: boolean
) => {
  const tokenEligible = isIssuance
    ? isEligibleLeveragedToken(outputToken)
    : isEligibleLeveragedToken(inputToken)

  const isIcEth =
    inputToken.symbol === icETHIndex.symbol ||
    outputToken.symbol === icETHIndex.symbol

  if (tokenEligible && isIcEth && isIssuance) {
    // Only ETH or stETH is allowed as input for icETH issuance at the moment
    return (
      inputToken.symbol === ETH.symbol || inputToken.symbol === STETH.symbol
    )
  }

  if (tokenEligible && isIcEth && !isIssuance) {
    // Only ETH is allowed as output for icETH redeeming at the moment
    return outputToken.symbol === ETH.symbol
  }

  return tokenEligible
}

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
  quotes: {
    exchangeIssuanceLeveraged: null,
    exchangeIssuanceZeroEx: null,
    zeroEx: null,
  },
  success: false,
}

export const useBestTradeOption = () => {
  const { provider } = useWallet()
  const { chain } = useNetwork()
  const { getBalance } = useBalances()
  const chainId = chain?.id

  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [quoteResult, setQuoteResult] =
    useState<QuoteResult>(defaultQuoteResult)
  const [result, setResult] = useState<Result<ZeroExData, Error> | null>(null)

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
          setTokenAmount: BigNumber.from(
            isIssuance ? dexSwapOption.buyAmount : sellTokenAmount
          ),
          inputOutputTokenAmount: BigNumber.from(
            isIssuance ? sellTokenAmount : dexSwapOption.buyAmount
          ),
          // type specific properties
          minOutput: dexSwapOption.minOutput,
          sources: dexSwapOption.sources,
        }
      : null

    /* Determine set token amount based on different factors */
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

    /* Check for Exchange Issuance option */
    let exchangeIssuanceOption: ExchangeIssuanceQuote | null = null
    let exchangeIssuanceZeroExQuote: ExchangeIssuanceZeroExQuote | null = null
    let leveragedExchangeIssuanceOption: LeveragedExchangeIssuanceQuote | null =
      null
    let exchangeIssuanceLeveragedQuote: ExchangeIssuanceLeveragedQuote | null =
      null

    // Create an instance of ZeroExApi (to pass to quote functions)
    const affilliateAddress = '0x37e6365d4f6aE378467b0e24c9065Ce5f06D70bF'
    const networkKey = getNetworkKey(chainId)
    const swapPathOverride = `/${networkKey}/swap/v1/quote`
    const zeroExApi = new ZeroExApi(
      `${IndexApiBaseUrl}/0x`,
      affilliateAddress,
      swapPathOverride
    )

    const inputToken = {
      symbol: sellToken.symbol,
      decimals: sellToken.decimals,
      address: inputTokenAddress,
    }
    const outputToken = {
      symbol: buyToken.symbol,
      decimals: buyToken.decimals,
      address: outputTokenAddress,
    }

    const tokenEligibleForLeveragedEI = isEligibleTradePair(
      sellToken,
      buyToken,
      isIssuance
    )
    if (tokenEligibleForLeveragedEI) {
      try {
        const quoteLeveraged = await getExchangeIssuanceLeveragedQuote(
          inputToken,
          outputToken,
          setTokenAmount,
          isIssuance,
          slippage,
          zeroExApi,
          provider,
          chainId ?? 1
        )
        if (quoteLeveraged) {
          leveragedExchangeIssuanceOption = {
            swapDataDebtCollateral: quoteLeveraged.swapDataDebtCollateral,
            swapDataPaymentToken: quoteLeveraged.swapDataPaymentToken,
            inputTokenAmount: quoteLeveraged.inputOutputTokenAmount,
            setTokenAmount: quoteLeveraged.setTokenAmount,
          }
          // Will replace above
          const gasLimit = BigNumber.from(1800000)
          exchangeIssuanceLeveragedQuote = {
            type: QuoteType.exchangeIssuanceLeveraged,
            isIssuance,
            inputToken: sellToken,
            outputToken: buyToken,
            gas: gasLimit,
            gasPrice,
            gasCosts: gasLimit.mul(gasPrice),
            fullCostsInUsd: getFullCostsInUsd(
              quoteLeveraged.inputOutputTokenAmount,
              gasLimit.mul(gasPrice),
              sellToken.decimals,
              sellTokenPrice,
              nativeTokenPrice
            ),
            priceImpact: 0,
            setTokenAmount,
            inputOutputTokenAmount: quoteLeveraged.inputOutputTokenAmount,
            // type specific properties
            swapDataDebtCollateral: quoteLeveraged.swapDataDebtCollateral,
            swapDataPaymentToken: quoteLeveraged.swapDataPaymentToken,
          }
        }
        console.log(slippage, slippagePercentage, quoteLeveraged)
      } catch (e) {
        console.warn('error when generating leveraged ei option', e)
      }
    } else {
      // For now only allow trade on mainnet, some tokens are disabled
      const isEligibleTradePair = isEligibleTradePairZeroEx(sellToken, buyToken)
      if (chainId === MAINNET.chainId && isEligibleTradePair)
        try {
          const spendingTokenBalance: BigNumber =
            getBalance(sellToken.symbol) || BigNumber.from(0)
          const quote0x = await getExchangeIssuanceZeroExQuote(
            inputToken,
            outputToken,
            setTokenAmount,
            isIssuance,
            slippage,
            zeroExApi,
            provider,
            chainId
          )
          if (quote0x) {
            const gasEstimate = await getExchangeIssuanceGasEstimate(
              provider,
              chainId,
              isIssuance,
              sellToken,
              buyToken,
              setTokenAmount,
              quote0x.inputOutputTokenAmount,
              spendingTokenBalance,
              quote0x.componentQuotes
            )
            exchangeIssuanceOption = {
              tradeData: quote0x.componentQuotes,
              inputTokenAmount: quote0x.inputOutputTokenAmount,
              setTokenAmount: quote0x.setTokenAmount,
              gas: gasEstimate,
            }
            // Will replace above
            exchangeIssuanceZeroExQuote = {
              type: QuoteType.exchangeIssuanceZeroEx,
              isIssuance,
              inputToken: sellToken,
              outputToken: buyToken,
              gas: gasEstimate,
              gasPrice,
              gasCosts: gasEstimate.mul(gasPrice),
              fullCostsInUsd: getFullCostsInUsd(
                quote0x.inputOutputTokenAmount,
                gasEstimate.mul(gasPrice),
                sellToken.decimals,
                sellTokenPrice,
                nativeTokenPrice
              ),
              priceImpact: 0,
              setTokenAmount,
              inputOutputTokenAmount: quote0x.inputOutputTokenAmount,
              // type specific properties
              componentQuotes: quote0x.componentQuotes,
            }
          }
        } catch (e) {
          console.warn('error when generating zeroexei option', e)
        }
    }

    console.log(
      'exchangeIssuanceOption',
      exchangeIssuanceOption,
      exchangeIssuanceOption?.inputTokenAmount.toString()
    )
    console.log('exchangeIssuanceZeroExQuote', exchangeIssuanceZeroExQuote)
    console.log('////////')
    console.log(
      'levExchangeIssuanceOption',
      leveragedExchangeIssuanceOption,
      leveragedExchangeIssuanceOption?.inputTokenAmount.toString()
    )
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
      bestQuote,
      quotes: {
        exchangeIssuanceLeveraged: exchangeIssuanceLeveragedQuote,
        exchangeIssuanceZeroEx: exchangeIssuanceZeroExQuote,
        zeroEx: zeroExQuote,
      },
    }
    // console.log(quoteResult)

    const result: Result<ZeroExData, Error> = dexSwapError
      ? { success: false, error: dexSwapError }
      : {
          success: true,
          dexData: dexSwapOption,
          exchangeIssuanceData: exchangeIssuanceOption,
          leveragedExchangeIssuanceData: leveragedExchangeIssuanceOption,
        }
    setResult(result)
    setQuoteResult(quoteResult)
    setIsFetching(false)
  }

  return {
    bestOptionResult: result,
    fetchAndCompareOptions,
    isFetchingTradeData: isFetching,
    quoteResult,
  }
}
