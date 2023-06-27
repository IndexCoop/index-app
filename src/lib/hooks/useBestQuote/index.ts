import { useState } from 'react'

import { PopulatedTransaction } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'

import { Token } from '@/constants/tokens'
import { useNetwork } from '@/lib/hooks/useNetwork'
import { useBalanceData } from '@/lib/providers/Balances'
import { toWei } from '@/lib/utils'
import { GasStation } from '@/lib/utils/api/gasStation'
import { getZeroExTradeData, ZeroExData } from '@/lib/utils/api/zeroExUtils'
import { getFullCostsInUsd, getGasCostsInUsd } from '@/lib/utils/costs'
import { getAddressForToken } from '@/lib/utils/tokens'

import { useWallet } from '../useWallet'
import { getBestQuote } from './bestQuote'
import { getEnhancedFlashMintQuote } from './flashMint'

export enum QuoteType {
  notAvailable = 'notAvailable',
  exchangeIssuanceLeveraged = 'exchangeIssuanceLeveraged',
  exchangeIssuanceZeroEx = 'exchangeIssuanceZeroEx',
  flashMint = 'flashMint',
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

export interface EnhancedFlashMintQuote extends Quote {
  contractType: string
  contract: string
  tx: PopulatedTransaction
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
    flashMint: EnhancedFlashMintQuote | null
  }
  savingsUsd: number
}

// To determine if price impact for DEX is smaller 5%
export const maxPriceImpact = 5

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
        flashMint: null,
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

      const flashMintQuote = await getEnhancedFlashMintQuote(
        isMinting,
        inputTokenAddress,
        outputTokenAddress,
        sellToken,
        buyToken,
        indexTokenAmount,
        sellTokenPrice,
        nativeTokenPrice,
        gasPrice,
        slippage,
        chainId,
        provider,
        signer
      )

      console.log('////////')
      console.log('exchangeIssuanceZeroExQuote', flashMintQuote)

      const bestQuote = getBestQuote(
        zeroExQuote?.fullCostsInUsd ?? null,
        flashMintQuote?.fullCostsInUsd ?? null,
        zeroExQuote?.priceImpact ?? 5
      )

      const getSavings = (): number => {
        if (!zeroExQuote) return 0
        if (bestQuote.type === QuoteType.flashMint && flashMintQuote) {
          return (
            (zeroExQuote.fullCostsInUsd ?? 0) -
            (flashMintQuote.fullCostsInUsd ?? 0)
          )
        }
        return 0
      }

      const flashMintIsBestQuote = bestQuote.type === QuoteType.flashMint
      const savingsUsd = getSavings()
      console.log(
        flashMintIsBestQuote,
        savingsUsd,
        flashMintQuote?.fullCostsInUsd,
        zeroExQuote?.fullCostsInUsd,
        'isBestQuote/savings'
      )

      const quoteResult: MoreQuotesResult = {
        hasBetterQuote: flashMintIsBestQuote,
        isReasonPriceImpact: bestQuote.priceImpact,
        quotes: {
          flashMint: flashMintIsBestQuote ? flashMintQuote : null,
        },
        savingsUsd,
      }

      setQuoteResultOptions(quoteResult)
      setIsFetchingMoreOptions(false)
    }

    console.log('FETCH MORE...')
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
