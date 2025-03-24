import { useQuery } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { usePublicClient } from 'wagmi'

import { tradeMachineAtom } from '@/app/store/trade-machine'
import { formatQuoteAnalytics, useAnalytics } from '@/lib/hooks/use-analytics'
import { type QuoteResult, QuoteType } from '@/lib/hooks/use-best-quote/types'
import { getFlashMintQuote } from '@/lib/hooks/use-best-quote/utils/flashmint'
import { getTokenPrice } from '@/lib/hooks/use-token-price'

import type { Token } from '@/constants/tokens'

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

  useEffect(() => {
    if (flashmintQuote) {
      logEvent('Quote Received', formatQuoteAnalytics(flashmintQuote))
    }

    if (flashmintQuote === undefined) return

    const quoteResult = {
      type: flashmintQuote?.type ?? QuoteType.flashmint,
      isAvailable: true,
      quote: flashmintQuote,
      error: null,
    }

    setQuoteResult(quoteResult)
    sendTradeEvent({
      type: 'QUOTE',
      quoteResult,
      quoteType: flashmintQuote?.type ?? QuoteType.flashmint,
    })
  }, [chainId, flashmintQuote, logEvent, sendTradeEvent])

  return {
    isFetchingQuote: isFetchingFlashMintQuote,
    quoteResult,
    resetQuote,
  }
}
