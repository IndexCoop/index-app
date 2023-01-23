import { useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { SwapData, ZeroExApi } from '@indexcoop/flash-mint-sdk'

import { Token } from 'constants/tokens'
import { useNetwork } from 'hooks/useNetwork'
import { useBalanceData } from 'providers/Balances'
import { toWei } from 'utils'
import { GasStation } from 'utils/api/gasStation'
import { getConfiguredZeroExApi } from 'utils/api/zeroExApi'
import {
  getNetworkKey,
  getZeroExTradeData,
  ZeroExData,
} from 'utils/api/zeroExUtils'
import { getFullCostsInUsd, getGasCostsInUsd } from 'utils/costs'
import { getAddressForToken } from 'utils/tokens'

import { useWallet } from '../useWallet'

import { getEnhancedFlashMintLeveragedQuote } from './flashMintLeveraged'
import { getEnhancedFlashMintZeroExQuote } from './flashMintZeroEx'

export enum QuoteType {
  notAvailable = 'notAvailable',
  exchangeIssuanceLeveraged = 'exchangeIssuanceLeveraged',
  exchangeIssuanceZeroEx = 'exchangeIssuanceZeroEx',
  flashMintNotional = 'flashMintNotional',
  zeroEx = 'zeroEx',
}

interface Quote {
  type: QuoteType
  isMinting: boolean
  inputToken: Token
  outputToken: Token
  gas: BigNumber
  gasPrice: BigNumber
  gasCosts: BigNumber
  gasCostsInUsd: number
  fullCostsInUsd: number | null
  priceImpact: number
  indexTokenAmount: BigNumber
  inputOutputTokenAmount: BigNumber
}

export interface ExchangeIssuanceLeveragedQuote extends Quote {
  swapDataDebtCollateral: SwapData
  swapDataPaymentToken: SwapData
}

export interface ExchangeIssuanceZeroExQuote extends Quote {
  componentQuotes: string[]
}

export interface FlashMintNotionalQuote extends Quote {
  swapData: SwapData[]
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
  error: Error | null
  quotes: {
    zeroEx: ZeroExQuote | null
  }
}

type MoreQuotesResult = {
  hasBetterQuote: boolean
  isReasonPriceImpact: boolean
  quotes: {
    exchangeIssuanceLeveraged: ExchangeIssuanceLeveragedQuote | null
    exchangeIssuanceZeroEx: ExchangeIssuanceZeroExQuote | null
  }
  savingsUsd: number
}

// To determine if price impact for DEX is smaller 5%
export const maxPriceImpact = 5

export function getBestQuote(
  fullCosts0x: number | null,
  fullCostsEI: number | null,
  fullCostsLevEI: number | null,
  priceImpactDex: number
): { type: QuoteType; priceImpact: boolean } {
  if (fullCostsEI === null && fullCostsLevEI === null) {
    return { type: QuoteType.zeroEx, priceImpact: false }
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
    return { type: QuoteType.zeroEx, priceImpact: false }
  }

  const cheapestQuote = cheapestQuotes[0]
  const bestOption = cheapestQuote[0]

  // If only one quote, return best option immediately
  if (cheapestQuotes.length === 1) {
    return { type: bestOption, priceImpact: false }
  }

  // If multiple quotes, check price impact of 0x option
  if (bestOption === QuoteType.zeroEx && priceImpactDex >= maxPriceImpact) {
    // In case price impact is too high, return cheapest exchange issuance
    return { type: cheapestQuotes[1][0], priceImpact: true }
  }

  return { type: bestOption, priceImpact: false }
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
  error: null,
  quotes: {
    zeroEx: null,
  },
}

export const useBestQuote = () => {
  const { provider, signer } = useWallet()
  const { chainId: networkChainId } = useNetwork()
  const { getTokenBalance } = useBalanceData()
  // Assume mainnet when no chain is connected (to be able to fetch quotes)
  const chainId = networkChainId ?? 1

  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [isFetchingMoreOptions, setIsFetchingMoreOptions] =
    useState<boolean>(false)
  const [quoteResult, setQuoteResult] =
    useState<QuoteResult>(defaultQuoteResult)
  const [quoteResultOptions, setQuoteResultOptions] =
    useState<MoreQuotesResult>({
      hasBetterQuote: false,
      isReasonPriceImpact: false,
      quotes: {
        exchangeIssuanceLeveraged: null,
        exchangeIssuanceZeroEx: null,
      },
      savingsUsd: 0,
    })

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
    isMinting: boolean,
    slippage: number
  ) => {
    const inputTokenAddress = getAddressForToken(sellToken, chainId)
    const outputTokenAddress = getAddressForToken(buyToken, chainId)

    if (!provider || !chainId) {
      console.error('Error fetching quotes - no provider or chain id present')
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
    const dexSwapError = zeroExResult.success
      ? null
      : new Error('Not enough liqiuidity available for trade.')
    const gasLimit0x = BigNumber.from(dexSwapOption?.gas ?? '0')
    const gasPrice0x = BigNumber.from(dexSwapOption?.gasPrice ?? '0')
    const gas0x = gasPrice0x.mul(gasLimit0x)
    const sellTokenAmountInWei = toWei(sellTokenAmount, sellToken.decimals)
    const gasCostsInUsd = getGasCostsInUsd(gas0x, nativeTokenPrice)
    const zeroExQuote: ZeroExQuote | null = dexSwapOption
      ? {
          type: QuoteType.zeroEx,
          isMinting,
          inputToken: sellToken,
          outputToken: buyToken,
          gas: gasLimit0x,
          gasPrice: gasPrice0x,
          gasCosts: gas0x,
          gasCostsInUsd,
          fullCostsInUsd: getFullCostsInUsd(
            toWei(sellTokenAmount, sellToken.decimals),
            gas0x,
            sellToken.decimals,
            sellTokenPrice,
            nativeTokenPrice
          ),
          priceImpact: parseFloat(dexSwapOption.estimatedPriceImpact ?? '5'),
          indexTokenAmount: isMinting
            ? BigNumber.from(dexSwapOption.buyAmount)
            : sellTokenAmountInWei,
          inputOutputTokenAmount: isMinting
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

    const fetchAndCompareMoreOptions = async () => {
      setIsFetchingMoreOptions(true)

      /* Determine Set token amount based on different factors */
      let indexTokenAmount = getSetTokenAmount(
        isMinting,
        sellTokenAmount,
        sellToken.decimals,
        sellTokenPrice,
        buyTokenPrice,
        dexSwapOption
      )

      const gasStation = new GasStation(provider)
      const gasPrice = await gasStation.getGasPrice()

      // Create an instance of ZeroExApi (to pass to quote functions)
      const networkKey = getNetworkKey(chainId)
      const swapPathOverride = `/${networkKey}/swap/v1/quote`
      const zeroExApi = getConfiguredZeroExApi(swapPathOverride)

      const inputTokenBalance =
        getTokenBalance(sellToken.symbol, chainId) ?? BigNumber.from(0)

      const exchangeIssuanceLeveragedQuote: ExchangeIssuanceLeveragedQuote | null =
        await getEnhancedFlashMintLeveragedQuote(
          isMinting,
          inputTokenAddress,
          outputTokenAddress,
          inputTokenBalance,
          sellToken,
          buyToken,
          indexTokenAmount,
          sellTokenPrice,
          nativeTokenPrice,
          gasPrice,
          slippage,
          chainId,
          provider,
          zeroExApi,
          signer
        )
      const exchangeIssuanceZeroExQuote: ExchangeIssuanceZeroExQuote | null =
        await getEnhancedFlashMintZeroExQuote(
          isMinting,
          inputTokenAddress,
          outputTokenAddress,
          inputTokenBalance,
          sellToken,
          buyToken,
          indexTokenAmount,
          sellTokenPrice,
          nativeTokenPrice,
          gasPrice,
          slippage,
          chainId,
          provider,
          zeroExApi,
          signer
        )
      // TODO: add FlashMintNotional

      console.log('////////')
      console.log('exchangeIssuanceZeroExQuote', exchangeIssuanceZeroExQuote)
      console.log(
        'exchangeIssuanceLeveragedQuote',
        exchangeIssuanceLeveragedQuote
      )

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

      const isFlashMintLeveragedBestQuote =
        bestQuote.type === QuoteType.exchangeIssuanceLeveraged
      const isFlashMintZeroExBestQuote =
        bestQuote.type === QuoteType.exchangeIssuanceZeroEx
      const isReasonPriceImpact = bestQuote.priceImpact

      const hasBetterQuote =
        isFlashMintLeveragedBestQuote || isFlashMintZeroExBestQuote

      const getSavings = (): number => {
        if (!zeroExQuote) return 0
        if (isFlashMintLeveragedBestQuote && exchangeIssuanceLeveragedQuote) {
          return (
            (zeroExQuote.fullCostsInUsd ?? 0) -
            (exchangeIssuanceLeveragedQuote.fullCostsInUsd ?? 0)
          )
        }
        if (isFlashMintZeroExBestQuote && exchangeIssuanceZeroExQuote) {
          return (
            (zeroExQuote.fullCostsInUsd ?? 0) -
            (exchangeIssuanceZeroExQuote.fullCostsInUsd ?? 0)
          )
        }
        return 0
      }

      const savingsUsd = getSavings()

      const quoteResult: MoreQuotesResult = {
        hasBetterQuote,
        isReasonPriceImpact,
        quotes: {
          exchangeIssuanceLeveraged: isFlashMintLeveragedBestQuote
            ? exchangeIssuanceLeveragedQuote
            : null,
          exchangeIssuanceZeroEx: isFlashMintZeroExBestQuote
            ? exchangeIssuanceZeroExQuote
            : null,
        },
        savingsUsd,
      }

      setQuoteResultOptions(quoteResult)
      setIsFetchingMoreOptions(false)
    }

    // The individual Flash Mint functions will check if the the token pair is eligible
    fetchAndCompareMoreOptions()

    const quoteResult: QuoteResult = {
      error: dexSwapError,
      quotes: {
        zeroEx: zeroExQuote,
      },
    }

    setQuoteResult(quoteResult)
    setIsFetching(false)
  }

  return {
    fetchAndCompareOptions,
    isFetchingZeroEx: isFetching,
    isFetchingMoreOptions,
    quoteResult,
    quoteResultOptions,
  }
}
