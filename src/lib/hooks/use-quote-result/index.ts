import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { usePublicClient } from 'wagmi'

import { tradeMachineAtom } from '@/app/store/trade-machine'
import { formatQuoteAnalytics, useAnalytics } from '@/lib/hooks/use-analytics'
import { QuoteType } from '@/lib/hooks/use-best-quote/types'
import {
  getFlashMintQuote,
  isQuoteError,
} from '@/lib/hooks/use-best-quote/utils/flashmint'
import { getTokenPrice } from '@/lib/hooks/use-token-price'

import type { Token } from '@/constants/tokens'
import get from 'lodash/get'

// Ideally this could come from Flashmint SDK
const quoteErrorCode = {
  ComponentsSwapDataError: 'Component Swap Error',
  ComponentQuotesError: 'Component Quote Error',
  IS_AAVE_NULL: 'Aave',
  LEVERAGED_TOKEN_DATA_NULL: 'Leveraged Token Data Error',
  DEBT_COLLATERAL_SWAP_DATA_NULL: 'Debt - Collateral Swap Error',
  INPUT_OUTPUT_SWAP_DATA_NULL: 'Input - Output Swap Error',
  MintingNotSupported: 'Minting Not Supported',
  WETHAddressNotDefined: 'Weth Address Not Defined',
  QuoteResultNull: 'Quote Not Found',
  CONFIGURATION_ERROR: 'Configuration Error',
  ENCODING_ERROR: 'msg',
  INDEX_TOKEN_NOT_SUPPORTED: 'msg',
  QUOTE_FAILED: 'msg',
}

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
  const [tradeState, sendTradeEvent] = useAtom(tradeMachineAtom)

  const fetchFlashMintQuote = async () => {
    sendTradeEvent({ type: 'FETCHING_QUOTE' })

    if (!address) return null
    if (!chainId) return null
    if (!publicClient) return null
    if (inputTokenAmount <= 0) return null
    if (!indexToken) return null

    const [inputTokenPrice, outputTokenPrice] = await Promise.all([
      getTokenPrice(inputToken, chainId),
      getTokenPrice(outputToken, chainId),
    ])

    return getFlashMintQuote({
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

  const {
    data: flashmintQuote,
    isFetching: isFetchingFlashMintQuote,
    refetch: refetchQuote,
  } = useQuery({
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
    if (flashmintQuote === undefined || isFetchingFlashMintQuote) return

    if (isQuoteError(flashmintQuote)) {
      logEvent('Quote Failed', flashmintQuote)

      sendTradeEvent({
        type: 'QUOTE_NOT_FOUND',
        reason:
          get(quoteErrorCode, `${flashmintQuote.type}`) ?? 'Unknown Reason',
      })

      return
    }

    if (flashmintQuote) {
      logEvent('Quote Received', formatQuoteAnalytics(flashmintQuote))
    }

    const quoteResult = {
      type: flashmintQuote?.type ?? QuoteType.flashmint,
      isAvailable: true,
      quote: flashmintQuote,
      error: null,
    }

    if (quoteResult.quote) {
      sendTradeEvent({
        type: 'QUOTE',
        quoteResult,
        quoteType: flashmintQuote?.type ?? QuoteType.flashmint,
      })
    }
  }, [
    chainId,
    flashmintQuote,
    isFetchingFlashMintQuote,
    logEvent,
    sendTradeEvent,
  ])

  return {
    isFetchingQuote: isFetchingFlashMintQuote,
    quoteResult: tradeState.context.quoteResult,
    isFetchingFlashMintQuote,
    refetchQuote,
  }
}
