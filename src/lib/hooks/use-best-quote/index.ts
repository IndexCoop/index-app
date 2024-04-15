import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePublicClient } from 'wagmi'

import { Token } from '@/constants/tokens'
import {
  getEnhancedIssuanceQuote,
  getEnhancedRedemptionQuote,
} from '@/lib/hooks/use-best-quote/utils/issuance'
import { useNetwork } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'
import { toWei } from '@/lib/utils'
import {
  getAddressForToken,
  isAvailableForFlashMint,
  isAvailableForIssuance,
  isAvailableForRedemption,
  isAvailableForSwap,
} from '@/lib/utils/tokens'

import { formatQuoteAnalytics, useAnalytics } from '../use-analytics'
import { getTokenPrice, useNativeTokenPrice } from '../use-token-price'

import { Quote, QuoteResults, QuoteType, ZeroExQuote } from './types'
import { getBestQuote } from './utils/best-quote'
import { getFlashMintQuote } from './utils/flashmint'
import { get0xQuote } from './utils/zeroex'

export interface FetchQuoteRequest {
  isMinting: boolean
  inputToken: Token
  outputToken: Token
  inputTokenAmount: string
  slippage: number
}

const defaultResults: QuoteResults = {
  bestQuote: QuoteType.zeroex,
  results: { flashmint: null, issuance: null, redemption: null, zeroex: null },
}

export const useBestQuote = (
  isMinting: boolean,
  inputToken: Token,
  outputToken: Token,
) => {
  const publicClient = usePublicClient()
  const { address, jsonRpcProvider, provider } = useWallet()
  const { chainId: networkChainId } = useNetwork()
  const { logEvent } = useAnalytics()
  // Assume mainnet when no chain is connected (to be able to fetch quotes)
  const chainId = networkChainId ?? 1
  const nativeTokenPrice = useNativeTokenPrice(chainId)

  const [isFetching0x, setIsFetching0x] = useState<boolean>(false)
  const [isFetchingFlashmint, setIsFetchingFlashMint] = useState<boolean>(false)
  const [isFetchingIssuance, setIsFetchingIssuance] = useState<boolean>(false)
  const [isFetchingRedemption, setIsFetchingRedemption] =
    useState<boolean>(false)

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
      const inputTokenAmountWei = toWei(inputTokenAmount, inputToken.decimals)
      if (inputTokenAmountWei.isZero() || inputTokenAmountWei.isNegative()) {
        setQuoteResults(defaultResults)
        return
      }

      if (
        !provider ||
        !publicClient ||
        !chainId ||
        !address ||
        !jsonRpcProvider
      ) {
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

      const canFlashmintIndexToken = isAvailableForFlashMint(indexToken)
      const canRedeemIndexToken = isAvailableForRedemption(
        inputToken,
        outputToken,
      )
      const canSwapIndexToken = isAvailableForSwap(indexToken)

      const fetchFlashMintQuote = async () => {
        if (
          canFlashmintIndexToken &&
          !isAvailableForIssuance(inputToken, outputToken) &&
          !isAvailableForRedemption(inputToken, outputToken)
        ) {
          setIsFetchingFlashMint(true)
          console.log('canFlashmintIndexToken')
          const quoteFlashMint = await getFlashMintQuote(
            {
              ...request,
              account: address,
              chainId,
              inputToken,
              inputTokenAmountWei,
              inputTokenPrice,
              outputToken,
              outputTokenPrice,
              nativeTokenPrice,
            },
            provider,
            jsonRpcProvider,
          )
          logEvent('Quote Received', formatQuoteAnalytics(quoteFlashMint))
          setIsFetchingFlashMint(false)
          setQuoteFlashmint(quoteFlashMint)
        } else {
          setQuoteFlashmint(null)
        }
      }

      const fetchIssuanceQuote = async () => {
        if (isAvailableForIssuance(inputToken, outputToken)) {
          console.log('canIssue')
          setIsFetchingIssuance(true)
          const gasPrice = await provider.getGasPrice()
          const quoteIssuance = await getEnhancedIssuanceQuote(
            {
              ...request,
              account: address,
              isIssuance: isMinting,
              gasPrice,
              inputTokenAmount: inputTokenAmountWei.toBigInt(),
              inputToken,
              inputTokenPrice,
              outputToken,
              outputTokenPrice,
              nativeTokenPrice,
            },
            publicClient,
          )
          setIsFetchingIssuance(false)
          setQuoteIssuance(quoteIssuance)
        } else {
          setQuoteIssuance(null)
        }
      }

      const fetchRedemptionQuote = async () => {
        if (
          canRedeemIndexToken &&
          !isAvailableForIssuance(inputToken, outputToken)
        ) {
          console.log('canRedeemIndexToken')
          setIsFetchingRedemption(true)
          const gasPrice = await provider.getGasPrice()
          const quoteRedemption = await getEnhancedRedemptionQuote(
            {
              ...request,
              account: address,
              gasPrice: gasPrice,
              indexTokenAmount: inputTokenAmountWei.toBigInt(),
              inputToken,
              inputTokenPrice,
              outputToken,
              outputTokenPrice,
              nativeTokenPrice,
            },
            publicClient,
          )
          logEvent('Quote Received', formatQuoteAnalytics(quoteRedemption))
          setIsFetchingRedemption(false)
          setQuoteRedemption(quoteRedemption)
        } else {
          setQuoteRedemption(null)
        }
      }

      const fetchSwapQuote = async () => {
        if (
          canSwapIndexToken &&
          !isAvailableForIssuance(inputToken, outputToken) &&
          !isAvailableForRedemption(inputToken, outputToken)
        ) {
          setIsFetching0x(true)
          console.log('canSwapIndexToken')
          const quote0x = await get0xQuote({
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
        } else {
          setQuote0x(null)
        }
      }

      // Non await - because we want to fetch quotes in parallel
      fetchSwapQuote()
      fetchIssuanceQuote()
      fetchRedemptionQuote()
      fetchFlashMintQuote()
    },
    [
      address,
      chainId,
      indexToken,
      inputToken,
      isMinting,
      jsonRpcProvider,
      logEvent,
      outputToken,
      nativeTokenPrice,
      provider,
      publicClient,
    ],
  )

  useEffect(() => {
    if (isAvailableForRedemption(inputToken, outputToken)) {
      const results = {
        bestQuote: QuoteType.redemption,
        results: {
          flashmint: {
            type: QuoteType.flashmint,
            isAvailable: false,
            quote: null,
            error: null,
          },
          issuance: {
            type: QuoteType.issuance,
            isAvailable: true,
            quote: null,
            error: null,
          },
          redemption: {
            type: QuoteType.redemption,
            isAvailable: true,
            quote: quoteRedemption,
            error: null,
          },
          zeroex: {
            type: QuoteType.zeroex,
            isAvailable: false,
            quote: null,
            error: null,
          },
        },
      }
      setQuoteResults(results)
      return
    }
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
        zeroex: {
          type: QuoteType.zeroex,
          isAvailable: canSwapIndexToken,
          quote: quote0x,
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

  const isFetchingAnyQuote = useMemo(() => {
    return isFetching0x || isFetchingFlashmint
  }, [isFetching0x, isFetchingFlashmint])

  return {
    fetchQuote,
    isFetchingAnyQuote,
    isFetching0x,
    isFetchingFlashmint,
    isFetchingIssuance,
    isFetchingRedemption,
    quoteResults,
  }
}
