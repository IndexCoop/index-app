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

import { useNativeTokenPrice } from '../use-token-price'

import { getBestQuote } from './utils/best-quote'
import { getEnhancedFlashMintQuote } from './utils/flashmint'
import { getIndexTokenAmount } from './utils/index-token-amount'
import {
  IndexQuoteRequest,
  Quote,
  QuoteResult,
  QuoteType,
  ZeroExQuote,
} from './types'
import { get0xQuote } from './utils/zeroex'
import { maxPriceImpact } from './config'

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

      const indexToken = isMinting ? outputToken : inputToken
      const canFlashmintIndexToken = isAvailableForFlashMint(indexToken)
      const canSwapIndexToken = isAvailableForSwap(indexToken)

      let quote0x: ZeroExQuote | null = null
      let quoteFlashMint: Quote | null = null

      if (canSwapIndexToken) {
        quote0x = await get0xQuote({
          ...request,
          chainId,
          address: signer._address,
          nativeTokenPrice,
        })
      }

      if (canFlashmintIndexToken) {
        let dexData = null
        if (quote0x !== null) {
          const buyAmount = isMinting
            ? quote0x.indexTokenAmount.toString()
            : quote0x.inputOutputTokenAmount.toString()
          dexData = {
            buyAmount,
            estimatedPriceImpact: quote0x!.priceImpact.toString(),
          }
        }
        quoteFlashMint = await getFlashMintQuote(
          {
            ...request,
            chainId,
            dexData,
            inputTokenAmountWei,
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
            (quote0x.fullCostsInUsd ?? 0) - (quoteFlashMint.fullCostsInUsd ?? 0)
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
    inputTokenPrice,
    outputTokenPrice,
    dexData
  )

  const gasStation = new GasStation(provider)
  const gasPrice = await gasStation.getGasPrice()

  while (true) {
    const flashMintQuote = await getEnhancedFlashMintQuote(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputTokenPrice,
      nativeTokenPrice,
      gasPrice,
      slippage,
      chainId,
      provider,
      signer
    )
    // If there is no FlashMint quote, return immediately
    if (flashMintQuote === null) return null
    // For redeeming return quote immdediately
    if (!isMinting) return flashMintQuote
    // For minting check if we got a quote that is lower/equal than the input token amount
    // - since we should never go above what the user entered intitially.
    if (flashMintQuote?.inputOutputTokenAmount.lte(inputTokenAmountWei)) {
      return flashMintQuote
    }
    // Otherwise, run again using a lil less index token amount to receive less input token amount
    indexTokenAmount = indexTokenAmount.mul(99).div(100)
  }
}
