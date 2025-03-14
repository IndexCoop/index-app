import { useQuery } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { usePublicClient } from 'wagmi'

import { tradeMachineAtom } from '@/app/store/trade-machine'
import { Token } from '@/constants/tokens'
import { formatQuoteAnalytics, useAnalytics } from '@/lib/hooks/use-analytics'
import { QuoteResult, QuoteType } from '@/lib/hooks/use-best-quote/types'
import { getFlashMintQuote } from '@/lib/hooks/use-best-quote/utils/flashmint'
import { getIndexQuote } from '@/lib/hooks/use-best-quote/utils/index-quote'
import { getBestYieldQuote } from '@/lib/hooks/use-quote-result/best-quote'
import { getTokenPrice, useNativeTokenPrice } from '@/lib/hooks/use-token-price'

type QuoteRequest = {
  address: string | undefined
  chainId: number
  isMinting: boolean
  inputToken: Token
  outputToken: Token
  inputTokenAmount: bigint
  inputValue: string
  slippage: number
}

export function useQuoteResult(request: QuoteRequest) {
  const {
    address,
    chainId,
    inputToken,
    inputTokenAmount,
    inputValue,
    isMinting,
    outputToken,
    slippage,
  } = request
  const indexToken = isMinting ? outputToken : inputToken
  const nativeTokenPrice = useNativeTokenPrice(chainId)
  const publicClient = usePublicClient({ chainId })
  const { logEvent } = useAnalytics()
  const sendTradeEvent = useSetAtom(tradeMachineAtom)

  const [quoteResult, setQuoteResult] = useState<QuoteResult>({
    type: QuoteType.flashmint,
    isAvailable: true,
    quote: null,
    error: null,
  })

  const fetchFlashMintQuote = async () => {
    if (!address) return null
    if (!chainId) return null
    if (!publicClient) return null
    if (inputTokenAmount <= 0) return null
    if (!indexToken) return null
    const [inputTokenPrice, outputTokenPrice] = await Promise.all([
      getTokenPrice(inputToken, chainId),
      getTokenPrice(outputToken, chainId),
    ])
    return await getFlashMintQuote({
      isMinting,
      account: address,
      chainId,
      inputToken,
      inputTokenAmount: inputValue,
      inputTokenAmountWei: inputTokenAmount,
      inputTokenPrice,
      outputToken,
      outputTokenPrice,
      slippage,
    })
  }

  const fetchSwapQuote = async () => {
    if (!address) return null
    if (!chainId) return null
    if (!publicClient) return null
    if (inputTokenAmount <= 0) return null
    if (!indexToken) return null
    const [inputTokenPrice, outputTokenPrice] = await Promise.all([
      getTokenPrice(inputToken, chainId),
      getTokenPrice(outputToken, chainId),
    ])
    return await getIndexQuote({
      isMinting,
      chainId,
      address,
      inputToken,
      inputTokenAmount: inputValue,
      inputTokenPrice,
      outputToken,
      outputTokenPrice,
      nativeTokenPrice,
      slippage: 0.1,
    })
  }

  const resetQuote = () => {
    setQuoteResult({
      type: QuoteType.flashmint,
      isAvailable: true,
      quote: null,
      error: null,
    })
  }

  const { data: flashmintQuote, isFetching: isFetchingFlashMintQuote } =
    useQuery({
      queryKey: [
        'flashmint-quote',
        {
          address,
          chainId,
          inputToken,
          outputToken,
          inputTokenAmount: inputTokenAmount.toString(),
          publicClient,
        },
      ],
      queryFn: fetchFlashMintQuote,
      enabled:
        !!address &&
        !!chainId &&
        !!inputToken &&
        !!outputToken &&
        !!publicClient &&
        inputTokenAmount > 0,
      refetchOnWindowFocus: false,
    })

  const { data: swapQuote, isFetching: isFetchingSwapQuote } = useQuery({
    queryKey: [
      'swap-quote',
      {
        address,
        chainId,
        inputToken,
        outputToken,
        inputTokenAmount: inputTokenAmount.toString(),
        publicClient,
      },
    ],
    queryFn: fetchSwapQuote,
    enabled:
      !!address &&
      !!chainId &&
      !!publicClient &&
      !!inputToken &&
      !!outputToken &&
      inputTokenAmount > 0,
  })

  useEffect(() => {
    const bestQuote = getBestYieldQuote(
      flashmintQuote ?? null,
      swapQuote ?? null,
      chainId ?? -1,
    )
    if (bestQuote) {
      logEvent('Quote Received', formatQuoteAnalytics(bestQuote))
    }

    const quoteResult = {
      type: bestQuote?.type ?? QuoteType.flashmint,
      isAvailable: true,
      quote: bestQuote,
      error: null,
    }

    setQuoteResult(quoteResult)
    sendTradeEvent({
      type: 'QUOTE',
      quoteResult,
      quoteType: bestQuote?.type ?? QuoteType.flashmint,
    })
  }, [chainId, flashmintQuote, logEvent, swapQuote, sendTradeEvent])

  return {
    isFetchingQuote: isFetchingFlashMintQuote || isFetchingSwapQuote,
    quoteResult,
    resetQuote,
  }
}
