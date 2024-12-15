import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePublicClient } from 'wagmi'

import { ARBITRUM } from '@/constants/chains'
import { Token } from '@/constants/tokens'
import {
  isAvailableForFlashMint,
  isAvailableForIssuance,
  isAvailableForSwap,
} from '@/lib/hooks/use-best-quote/utils/available'
import { getEnhancedIssuanceQuote } from '@/lib/hooks/use-best-quote/utils/issuance'
import { useNetwork } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'
import { parseUnits } from '@/lib/utils'
import { getAddressForToken } from '@/lib/utils/tokens'

import { formatQuoteAnalytics, useAnalytics } from '../use-analytics'
import { getTokenPrice, useNativeTokenPrice } from '../use-token-price'

import { Quote, QuoteResults, QuoteType, ZeroExQuote } from './types'
import { getBestQuote } from './utils/best-quote'
import { getFlashMintQuote } from './utils/flashmint'
import { getIndexQuote } from './utils/index-quote'

export interface FetchQuoteRequest {
  isMinting: boolean
  inputToken: Token
  outputToken: Token
  inputTokenAmount: string
  slippage: number
}

const defaultResults: QuoteResults = {
  bestQuote: QuoteType.index,
  results: { flashmint: null, issuance: null, redemption: null, index: null },
}

export const useBestQuote = (
  isMinting: boolean,
  inputToken: Token,
  outputToken: Token,
) => {
  const publicClient = usePublicClient()
  const { address, provider, rpcUrl } = useWallet()
  const { chainId: networkChainId } = useNetwork()
  const { logEvent } = useAnalytics()
  // Assume mainnet when no chain is connected (to be able to fetch quotes)
  const chainId = networkChainId ?? 1
  const nativeTokenPrice = useNativeTokenPrice(chainId)

  const [isFetching0x, setIsFetching0x] = useState<boolean>(false)
  const [isFetchingFlashmint, setIsFetchingFlashMint] = useState<boolean>(false)
  const [isFetchingIssuance, setIsFetchingIssuance] = useState<boolean>(false)

  const [quote0x, setQuote0x] = useState<ZeroExQuote | null>(null)
  const [quoteFlashMint, setQuoteFlashmint] = useState<Quote | null>(null)
  const [quoteIssuance, setQuoteIssuance] = useState<Quote | null>(null)
  const [quoteRedemption, setQuoteRedemption] = useState<Quote | null>(null)
  const [quoteResults, setQuoteResults] = useState<QuoteResults>(defaultResults)

  const indexToken = useMemo(
    () => (isMinting ? outputToken : inputToken),
    [inputToken, isMinting, outputToken],
  )

  const fetchQuote = useCallback(
    async (request: FetchQuoteRequest) => {
      const { inputTokenAmount } = request

      // Right now we only allow setting the input amount, so no need to check
      // ouput token amount here
      const inputTokenAmountWei = parseUnits(
        inputTokenAmount,
        inputToken.decimals,
      )
      if (
        inputTokenAmountWei === BigInt(0) ||
        inputTokenAmountWei < BigInt(0)
      ) {
        setQuoteResults(defaultResults)
        return
      }

      if (!provider || !publicClient || !chainId || !address || !rpcUrl) {
        console.error('Error fetching quotes - no provider or chain id present')
        return
      }

      const inputTokenAddress = getAddressForToken(inputToken, chainId)
      const outputTokenAddress = getAddressForToken(outputToken, chainId)

      if (!inputTokenAddress || !outputTokenAddress) {
        console.error(
          `Error can not determine input/ouput token address: ${chainId} ${inputToken.symbol} ${outputToken.symbol}`,
        )
        return
      }

      const inputTokenPrice = await getTokenPrice(inputToken, 1)
      const outputTokenPrice = await getTokenPrice(outputToken, 1)

      const canFlashmintIndexToken = isAvailableForFlashMint(indexToken)
      const canSwapIndexToken = isAvailableForSwap(indexToken)

      const fetchFlashMintQuote = async () => {
        if (
          canFlashmintIndexToken &&
          !isAvailableForIssuance(inputToken, outputToken)
        ) {
          setIsFetchingFlashMint(true)
          const quoteFlashMint = await getFlashMintQuote({
            ...request,
            account: address,
            chainId,
            inputToken,
            inputTokenAmountWei,
            inputTokenPrice,
            outputToken,
            outputTokenPrice,
          })

          logEvent('Quote Received', formatQuoteAnalytics(quoteFlashMint))
          setIsFetchingFlashMint(false)
          setQuoteFlashmint(quoteFlashMint)
        } else {
          setQuoteFlashmint(null)
        }
      }

      const fetchIssuanceQuote = async () => {
        if (isAvailableForIssuance(inputToken, outputToken)) {
          setIsFetchingIssuance(true)
          const quoteIssuance = await getEnhancedIssuanceQuote(
            {
              ...request,
              account: address,
              isIssuance: isMinting,
              inputTokenAmount: inputTokenAmountWei,
              inputToken,
              inputTokenPrice,
              outputToken,
              outputTokenPrice,
            },
            publicClient,
          )
          setIsFetchingIssuance(false)
          setQuoteIssuance(quoteIssuance)
        } else {
          setQuoteIssuance(null)
        }
      }

      const fetchIndexSwapQuote = async () => {
        if (
          canSwapIndexToken &&
          !isAvailableForIssuance(inputToken, outputToken)
        ) {
          setIsFetching0x(true)
          try {
            const quote0x = await getIndexQuote({
              ...request,
              chainId,
              address,
              inputToken,
              inputTokenPrice,
              outputToken,
              outputTokenPrice,
              nativeTokenPrice,
            })
            logEvent('Quote Received', formatQuoteAnalytics(quote0x))
            setIsFetching0x(false)
            setQuote0x(quote0x)
          } catch (e) {
            console.error('get0xQuote error', e)
            setIsFetching0x(false)
            setQuote0x(null)
            throw e
          }
        } else {
          setQuote0x(null)
        }
      }

      // Non await - because we want to fetch quotes in parallel
      if (chainId === ARBITRUM.chainId) {
        fetchIndexSwapQuote()
      } else {
        fetchIndexSwapQuote()
        fetchIssuanceQuote()
        fetchFlashMintQuote()
      }
    },
    [
      address,
      chainId,
      indexToken,
      inputToken,
      isMinting,
      logEvent,
      outputToken,
      nativeTokenPrice,
      provider,
      publicClient,
      rpcUrl,
    ],
  )

  useEffect(() => {
    const bestQuote = getBestQuote(
      quote0x?.fullCostsInUsd ?? null,
      quoteFlashMint?.fullCostsInUsd ?? null,
      quote0x?.outputTokenAmountUsdAfterFees ?? null,
      quoteFlashMint?.outputTokenAmountUsdAfterFees ?? null,
    )
    const canFlashmintIndexToken = isAvailableForFlashMint(indexToken)
    const canSwapIndexToken = isAvailableForSwap(indexToken)
    const results = {
      bestQuote,
      results: {
        flashmint: {
          type: QuoteType.flashmint,
          isAvailable: canFlashmintIndexToken,
          quote: quoteFlashMint,
          error: null,
        },
        index: {
          type: QuoteType.index,
          isAvailable: canSwapIndexToken,
          quote: quote0x,
          error: null,
        },
        issuance: {
          type: QuoteType.issuance,
          isAvailable: false,
          quote: null,
          error: null,
        },
        redemption: {
          type: QuoteType.redemption,
          isAvailable: false,
          quote: null,
          error: null,
        },
      },
    }
    setQuoteResults(results)
  }, [
    indexToken,
    inputToken,
    outputToken,
    quote0x,
    quoteFlashMint,
    quoteIssuance,
    quoteRedemption,
  ])

  useEffect(() => {
    // Reset quotes
    setQuote0x(null)
    setQuoteFlashmint(null)
    setQuoteIssuance(null)
    setQuoteRedemption(null)
    setQuoteResults(defaultResults)
  }, [chainId])

  const isFetchingAnyQuote = useMemo(() => {
    return isFetching0x || isFetchingFlashmint
  }, [isFetching0x, isFetchingFlashmint])

  return {
    fetchQuote,
    isFetchingAnyQuote,
    isFetching0x,
    isFetchingFlashmint,
    isFetchingIssuance,
    quoteResults,
  }
}
