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
          quoteFlashMint = await getFlashMintQuote(
            {
              ...request,
              chainId,
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
    outputTokenPrice
  )

  const gasStation = new GasStation(provider)
  const gasPrice = await gasStation.getGasPrice()

  let savedQuote: Quote | null = null

  const determineFactor = (diff: bigint, inputTokenAmount: bigint): bigint => {
    let ratio = Number(diff.toString()) / Number(inputTokenAmount.toString())
    console.log('ratio', ratio)
    if (Math.abs(ratio) < 0.0001) {
      // This is currently need to avoid infinite loops
      ratio = diff < 0 ? -0.0001 : 0.0001
    }
    return BigInt(Math.round((1 + ratio) * 10000))
  }

  for (let t = 2; t > 0; t--) {
    const flashMintQuote = await getEnhancedFlashMintQuote(
      isMinting,
      inputToken,
      outputToken,
      BigNumber.from(indexTokenAmount.toString()),
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
    savedQuote = flashMintQuote

    console.log('estimated index token amount', indexTokenAmount.toString())
    const diff = inputTokenAmountWei
      .sub(flashMintQuote.inputTokenAmount)
      .toBigInt()
    console.log('diff', diff.toString())
    const factor = determineFactor(diff, inputTokenAmountWei.toBigInt())
    console.log('factor', factor.toString())
    // console.log(
    //   inputTokenAmountWei.toString(),
    //   flashMintQuote.inputTokenAmount.toString(),
    //   indexTokenAmount.toString(),
    //   ((indexTokenAmount * factor) / BigInt(10000)).toString()
    // )

    indexTokenAmount = (indexTokenAmount * factor) / BigInt(10000)
    console.log('new index token amount', indexTokenAmount.toString())
    console.log('t', t)

    if (diff < 0 && t === 1) {
      t++ // loop one more time to stay under the input amount
    }
  }

  return savedQuote
}
