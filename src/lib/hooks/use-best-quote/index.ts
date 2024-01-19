import { useCallback, useState } from 'react'

import { BigNumber, providers } from 'ethers'

import { JsonRpcSigner } from '@ethersproject/providers'

import { useNetwork } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'
import { toWei } from '@/lib/utils'
import { GasStation } from '@/lib/utils/api/gas-station'
import {
  getAddressForToken,
  isAvailableForFlashMint,
  isAvailableForSwap,
} from '@/lib/utils/tokens'

import { getTokenPrice, useNativeTokenPrice } from '../use-token-price'

import { maxPriceImpact } from './config'
import { getBestQuote } from './utils/best-quote'
import { getEnhancedFlashMintQuote } from './utils/flashmint'
import { getIndexTokenAmount } from './utils/index-token-amount'
import { shouldReturnQuote } from './utils/should-return-quote'
import { get0xQuote } from './utils/zeroex'
import {
  IndexQuoteRequest,
  Quote,
  QuoteResult,
  QuoteType,
  ZeroExQuote,
} from './types'

const defaultQuoteResult: QuoteResult = {
  bestQuote: QuoteType.zeroex,
  error: null,
  quotes: {
    flashmint: null,
    zeroex: null,
  },
  isReasonPriceImpact: false,
  savingsUsd: 0,
}

export const useBestQuote = () => {
  const { provider, signer } = useWallet()
  const { chainId: networkChainId } = useNetwork()
  // Assume mainnet when no chain is connected (to be able to fetch quotes)
  const chainId = networkChainId ?? 1
  const nativeTokenPrice = useNativeTokenPrice(chainId)

  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [quoteResult, setQuoteResult] =
    useState<QuoteResult>(defaultQuoteResult)

  const fetchQuote = useCallback(
    async (request: IndexQuoteRequest) => {
      const { inputToken, inputTokenAmount, isMinting, outputToken } = request

      // Right now we only allow setting the input amount, so no need to check
      // ouput token amount here
      const inputTokenAmountWei = toWei(inputTokenAmount, inputToken.decimals)
      if (inputTokenAmountWei.isZero() || inputTokenAmountWei.isNegative()) {
        setQuoteResult(defaultQuoteResult)
        return
      }

      if (!provider || !chainId) {
        console.error('Error fetching quotes - no provider or chain id present')
        return
      }

      const inputTokenAddress = getAddressForToken(inputToken, chainId)
      const outputTokenAddress = getAddressForToken(outputToken, chainId)

      if (!inputTokenAddress || !outputTokenAddress) {
        console.log(inputTokenAddress, outputTokenAddress)
        console.error('Error can not determine input/ouput token address')
        return
      }

      setIsFetching(true)

      const inputTokenPrice = await getTokenPrice(inputToken, 1)
      const outputTokenPrice = await getTokenPrice(outputToken, 1)

      const indexToken = isMinting ? outputToken : inputToken
      const canFlashmintIndexToken = isAvailableForFlashMint(indexToken)
      const canSwapIndexToken = isAvailableForSwap(indexToken)

      let quote0x: ZeroExQuote | null = null
      let quoteFlashMint: Quote | null = null

      const fetchMoreQuotes = async () => {
        if (canFlashmintIndexToken) {
          console.log('canFlashmintIndexToken')
          let dexData = null
          if (quote0x !== null) {
            const buyAmount = isMinting
              ? quote0x.indexTokenAmount.toString()
              : quote0x.inputOutputTokenAmount.toString()
            dexData = {
              buyAmount,
              estimatedPriceImpact: quote0x.priceImpact?.toString() ?? '5',
            }
          }
          quoteFlashMint = await getFlashMintQuote(
            {
              ...request,
              chainId,
              dexData,
              inputTokenAmountWei,
              inputTokenPrice,
              outputTokenPrice,
              nativeTokenPrice,
            },
            provider,
            signer
          )
        }

        const bestQuote = getBestQuote(
          quote0x?.fullCostsInUsd ?? null,
          quoteFlashMint?.fullCostsInUsd ?? null,
          quote0x?.priceImpact ?? maxPriceImpact
        )

        const getSavings = (): number => {
          if (!quote0x) return 0
          if (bestQuote.type === QuoteType.flashmint && quoteFlashMint) {
            return (
              (quote0x.fullCostsInUsd ?? 0) -
              (quoteFlashMint.fullCostsInUsd ?? 0)
            )
          }
          return 0
        }
        const savingsUsd = getSavings()

        setQuoteResult({
          bestQuote: bestQuote.type,
          // TODO:
          error: null,
          // Not used at the moment but kept for potential re-introduction
          // Insted of one argument, could change to type of enums (reasons: ReasonType.)
          isReasonPriceImpact: bestQuote.priceImpact,
          quotes: {
            flashmint: quoteFlashMint,
            zeroex: quote0x,
          },
          // Not used at the moment but kept for potential re-introduction
          savingsUsd,
        })
        setIsFetching(false)
      }

      if (canSwapIndexToken) {
        console.log('canSwapIndexToken')
        quote0x = await get0xQuote({
          ...request,
          chainId,
          address: signer._address,
          inputTokenPrice,
          outputTokenPrice,
          nativeTokenPrice,
        })
        setQuoteResult({
          bestQuote: QuoteType.zeroex,
          error: null,
          isReasonPriceImpact: false,
          quotes: {
            flashmint: quoteFlashMint,
            zeroex: quote0x,
          },
          // Not used at the moment but kept for potential re-introduction
          savingsUsd: 0,
        })
      }

      // Non await because we already want to display the 0x quote - if one exists
      fetchMoreQuotes()
    },
    [chainId, nativeTokenPrice, provider, signer]
  )

  return {
    fetchQuote,
    isFetching,
    quoteResult,
  }
}

interface FlashMintQuoteRequest extends IndexQuoteRequest {
  chainId: number
  dexData: { buyAmount: string; estimatedPriceImpact: string } | null
  inputTokenAmountWei: BigNumber
  nativeTokenPrice: number
}

async function getFlashMintQuote(
  request: FlashMintQuoteRequest,
  provider: providers.JsonRpcProvider,
  signer: JsonRpcSigner
) {
  const {
    chainId,
    dexData,
    inputToken,
    inputTokenAmount,
    inputTokenAmountWei,
    inputTokenPrice,
    isMinting,
    nativeTokenPrice,
    outputToken,
    outputTokenPrice,
    slippage,
  } = request

  /* Determine initial index token amount based on different factors */
  let indexTokenAmount = getIndexTokenAmount(
    isMinting,
    inputTokenAmount,
    inputToken.decimals,
    outputToken.decimals,
    inputTokenPrice,
    outputTokenPrice,
    dexData
  )

  const gasStation = new GasStation(provider)
  const gasPrice = await gasStation.getGasPrice()

  let savedQuote: Quote | null = null
  const timestamp: number = new Date().getTime()
  console.log('timestamp:', timestamp)
  while (true) {
    const flashMintQuote = await getEnhancedFlashMintQuote(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputTokenPrice,
      outputTokenPrice,
      nativeTokenPrice,
      gasPrice,
      slippage,
      chainId,
      provider,
      signer
    )
    // If there is no FlashMint quote, return immediately
    if (flashMintQuote === null) return savedQuote
    // For redeeming return quote immdediately
    if (!isMinting) return flashMintQuote
    // As a safety measure we're aborting after 30 seconds take whatever quote we got
    const now: number = new Date().getTime()
    const diffSinceStart = (now - timestamp) / 1000
    console.log(timestamp, now, diffSinceStart)
    if (diffSinceStart > 10) return flashMintQuote
    // For minting check if we got a quote that is lower/equal than the input token amount
    // - since we should never go above what the user entered intitially. Additionally,
    // we're checking if there might be a too big of a difference to the original input amount.
    const { diff, shouldReturn } = shouldReturnQuote(
      inputTokenAmountWei.toBigInt(),
      flashMintQuote.inputTokenAmount.toBigInt()
    )
    if (shouldReturn) return flashMintQuote
    // Save last fetched quote to be able to return something if next run fails
    savedQuote = flashMintQuote
    console.log('diff:', diff.toString())
    const buffer = 1
    console.log(diff < 0, 100 - Math.floor(Math.abs(diff)) - buffer)
    console.log(diff >= 0, 100 + Math.round(Math.abs(diff)) - buffer)
    if (diff < 0) {
      // The quote input amount is too high, reduce
      indexTokenAmount = indexTokenAmount
        .mul(100 - Math.floor(Math.abs(diff)) - buffer)
        .div(100)
    } else {
      // The quote input amount is too low from the original input, increase
      indexTokenAmount = indexTokenAmount
        .mul(100 + Math.round(Math.abs(diff)) - buffer)
        .div(100)
    }
  }
}
