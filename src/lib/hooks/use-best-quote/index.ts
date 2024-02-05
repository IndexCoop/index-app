import { useCallback, useMemo, useState } from 'react'

import { useNetwork } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'
import { toWei } from '@/lib/utils'
import {
  getAddressForToken,
  isAvailableForFlashMint,
  isAvailableForSwap,
} from '@/lib/utils/tokens'

import { getTokenPrice, useNativeTokenPrice } from '../use-token-price'

import { getBestQuote } from './utils/best-quote'
import { getFlashMintQuote } from './utils/flashmint'
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
  canSwap: {
    flashmint: true,
    zeroex: true,
  },
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
          quote0x?.outputTokenAmountUsd ?? null,
          quoteFlashMint?.outputTokenAmountUsd ?? null
        )

        const getSavings = (): number => {
          if (!quote0x) return 0
          if (bestQuote === QuoteType.flashmint && quoteFlashMint) {
            return (
              (quote0x.fullCostsInUsd ?? 0) -
              (quoteFlashMint.fullCostsInUsd ?? 0)
            )
          }
          return 0
        }
        const savingsUsd = getSavings()

        setQuoteResult({
          bestQuote,
          // TODO:
          error: null,
          // Not used at the moment but kept for potential re-introduction
          // Insted of one argument, could change to type of enums (reasons: ReasonType.)
          isReasonPriceImpact: false,
          quotes: {
            flashmint: quoteFlashMint,
            zeroex: quote0x,
          },
          canSwap: {
            flashmint: canFlashmintIndexToken,
            zeroex: canSwapIndexToken,
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
          canSwap: {
            flashmint: canFlashmintIndexToken,
            zeroex: canSwapIndexToken,
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
