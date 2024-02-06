import { useCallback, useEffect, useMemo, useState } from 'react'

import { Token } from '@/constants/tokens'
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
  QuoteResults,
  QuoteType,
  ZeroExQuote,
} from './types'

const defaultResults: QuoteResults = {
  bestQuote: QuoteType.zeroex,
  results: { flashmint: null, zeroex: null },
}

export const useBestQuote = (
  isMinting: boolean,
  inputToken: Token,
  outputToken: Token
) => {
  const { provider, signer } = useWallet()
  const { chainId: networkChainId } = useNetwork()
  // Assume mainnet when no chain is connected (to be able to fetch quotes)
  const chainId = networkChainId ?? 1
  const nativeTokenPrice = useNativeTokenPrice(chainId)

  const [isFetching0x, setIsFetching0x] = useState<boolean>(false)
  const [isFetchingFlashmint, setIsFetchingFlashMint] = useState<boolean>(false)

  const [quote0x, setQuote0x] = useState<ZeroExQuote | null>(null)
  const [quoteFlashMint, setQuoteFlashmint] = useState<Quote | null>(null)
  const [quoteResults, setQuoteResults] = useState<QuoteResults>(defaultResults)

  const fetchQuote = useCallback(
    async (request: IndexQuoteRequest) => {
      const { inputTokenAmount } = request

      // Right now we only allow setting the input amount, so no need to check
      // ouput token amount here
      const inputTokenAmountWei = toWei(inputTokenAmount, inputToken.decimals)
      if (inputTokenAmountWei.isZero() || inputTokenAmountWei.isNegative()) {
        setQuoteResults(defaultResults)
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

      const inputTokenPrice = await getTokenPrice(inputToken, 1)
      const outputTokenPrice = await getTokenPrice(outputToken, 1)

      const indexToken = isMinting ? outputToken : inputToken
      const canFlashmintIndexToken = isAvailableForFlashMint(indexToken)
      const canSwapIndexToken = isAvailableForSwap(indexToken)

      const fetchFlashMintQuote = async () => {
        if (canFlashmintIndexToken) {
          setIsFetchingFlashMint(true)
          console.log('canFlashmintIndexToken')
          const quoteFlashMint = await getFlashMintQuote(
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
          setQuoteFlashmint(quoteFlashMint)
          setIsFetchingFlashMint(false)
        } else {
          setQuoteFlashmint(null)
        }
      }

      const fetchSwapQuote = async () => {
        if (canSwapIndexToken) {
          setIsFetching0x(true)
          console.log('canSwapIndexToken')
          const quote0x = await get0xQuote({
            ...request,
            chainId,
            address: signer._address,
            inputTokenPrice,
            outputTokenPrice,
            nativeTokenPrice,
          })
          setQuote0x(quote0x)
          setIsFetching0x(false)
        } else {
          setQuote0x(null)
        }
      }

      // Non await - because we want to fetch quotes in parallel
      fetchSwapQuote()
      fetchFlashMintQuote()
    },
    [
      chainId,
      inputToken,
      isMinting,
      outputToken,
      nativeTokenPrice,
      provider,
      signer,
    ]
  )

  useEffect(() => {
    const bestQuote = getBestQuote(
      quote0x?.fullCostsInUsd ?? null,
      quoteFlashMint?.fullCostsInUsd ?? null,
      quote0x?.outputTokenAmountUsd ?? null,
      quoteFlashMint?.outputTokenAmountUsd ?? null
    )
    const indexToken = isMinting ? outputToken : inputToken
    const canFlashmintIndexToken = isAvailableForFlashMint(indexToken)
    const canSwapIndexToken = isAvailableForSwap(indexToken)
    // TODO: only replace approriate quote?
    const results = {
      bestQuote,
      results: {
        flashmint: {
          type: QuoteType.flashmint,
          isAvailable: canFlashmintIndexToken,
          quote: quoteFlashMint,
          error: null,
        },
        zeroex: {
          type: QuoteType.zeroex,
          isAvailable: canSwapIndexToken,
          quote: quote0x,
          error: null,
        },
      },
    }
    setQuoteResults(results)
  }, [inputToken, isMinting, outputToken, quote0x, quoteFlashMint])

  const isFetchingAnyQuote = useMemo(() => {
    return isFetching0x || isFetchingFlashmint
  }, [isFetching0x, isFetchingFlashmint])

  return {
    fetchQuote,
    isFetchingAnyQuote,
    isFetching0x,
    isFetchingFlashmint,
    quoteResults,
  }
}
