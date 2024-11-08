'use client'

import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { useQuery } from '@tanstack/react-query'
import { BigNumber } from 'ethers'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { isAddress } from 'viem'
import { usePublicClient } from 'wagmi'

import { TransactionReview } from '@/components/swap/components/transaction-review/types'
import { ARBITRUM, MAINNET } from '@/constants/chains'
import {
  ETH,
  HighYieldETHIndex,
  IndexCoopEthereum2xIndex,
  Token,
} from '@/constants/tokens'
import { TokenBalance, useBalances } from '@/lib/hooks/use-balance'
import { Quote, QuoteResult, QuoteType } from '@/lib/hooks/use-best-quote/types'
import { getBestQuote } from '@/lib/hooks/use-best-quote/utils/best-quote'
import { getFlashMintQuote } from '@/lib/hooks/use-best-quote/utils/flashmint'
import { getIndexQuote } from '@/lib/hooks/use-best-quote/utils/index-quote'
import { useNetwork } from '@/lib/hooks/use-network'
import { useQueryParams } from '@/lib/hooks/use-query-params'
import { getTokenPrice, useNativeTokenPrice } from '@/lib/hooks/use-token-price'
import { useWallet } from '@/lib/hooks/use-wallet'
import { isValidTokenInput, parseUnits } from '@/lib/utils'
import {
  fetchTokenHistoricalData,
  fetchTokenMetrics,
} from '@/lib/utils/api/index-data-provider'

import { getCurrencyTokens, getYieldTokens } from './constants'
import { BaseTokenStats } from './types'

interface Context {
  inputValue: string
  isMinting: boolean
  balances: TokenBalance[]
  indexToken: Token
  indexTokens: Token[]
  apy: number | null
  apy7d: number | null
  apy30d: number | null
  nav: number | null
  tvl: number | null
  inputToken: Token
  outputToken: Token
  inputTokenAmount: bigint
  inputTokens: Token[]
  outputTokens: Token[]
  isFetchingQuote: boolean
  isFetchingStats: boolean
  quoteResult: QuoteResult | null
  stats: BaseTokenStats | null
  transactionReview: TransactionReview | null
  onChangeInputTokenAmount: (input: string) => void
  onSelectInputToken: (tokenSymbol: string) => void
  onSelectOutputToken: (tokenSymbol: string) => void
  reset: () => void
  toggleIsMinting: () => void
}

export const YieldContext = createContext<Context>({
  inputValue: '',
  isMinting: true,
  balances: [],
  indexToken: IndexCoopEthereum2xIndex,
  indexTokens: [],
  apy: null,
  apy7d: null,
  apy30d: null,
  nav: null,
  tvl: null,
  inputToken: ETH,
  outputToken: IndexCoopEthereum2xIndex,
  inputTokenAmount: BigInt(0),
  inputTokens: [],
  outputTokens: [],
  isFetchingQuote: false,
  isFetchingStats: true,
  quoteResult: null,
  stats: null,
  transactionReview: null,
  onChangeInputTokenAmount: () => {},
  onSelectInputToken: () => {},
  onSelectOutputToken: () => {},
  reset: () => {},
  toggleIsMinting: () => {},
})

export const useYieldContext = () => useContext(YieldContext)

const defaultParams = {
  isMinting: true,
  inputToken: ETH,
  outputToken: HighYieldETHIndex,
}

export function YieldProvider(props: { children: any }) {
  const publicClient = usePublicClient()
  const { chainId: chainIdRaw, switchChain } = useNetwork()
  const nativeTokenPrice = useNativeTokenPrice(chainIdRaw)
  const { address, provider, rpcUrl } = useWallet()
  const {
    queryParams: {
      queryNetwork,
      queryInputToken,
      queryOutputToken,
      queryIsMinting,
    },
    updateQueryParams,
  } = useQueryParams({ ...defaultParams, network: chainIdRaw })

  const [inputValue, setInputValue] = useState('')
  const [isFetchingQuote, setFetchingQuote] = useState(false)
  const [isMinting, setMinting] = useState<boolean>(queryIsMinting)
  const [inputToken, setInputToken] = useState<Token>(queryInputToken)
  const [outputToken, setOutputToken] = useState<Token>(queryOutputToken)
  const [flashmintQuote, setFlashmintQuote] = useState<Quote | null>(null)
  const [swapQuote, setSwapQuote] = useState<Quote | null>(null)
  const [quoteResult, setQuoteResult] = useState<QuoteResult>({
    type: QuoteType.flashmint,
    isAvailable: true,
    quote: null,
    error: null,
  })

  const chainId = useMemo(() => {
    return chainIdRaw ?? MAINNET.chainId
  }, [chainIdRaw])

  useEffect(() => {
    // queryNetwork is only set on the initial load
    if (queryNetwork) {
      switchChain({ chainId: queryNetwork })
    }
  }, [queryNetwork, switchChain])

  const indexToken = useMemo(() => {
    if (isMinting) return outputToken
    return inputToken
  }, [inputToken, isMinting, outputToken])

  const indexTokenAddress = useMemo(() => {
    return getTokenByChainAndSymbol(chainId, indexToken.symbol)?.address ?? ''
  }, [chainId, indexToken.symbol])

  const indexTokens = useMemo(() => {
    return getYieldTokens(chainId)
  }, [chainId])

  const indexTokenAddresses = useMemo(() => {
    return indexTokens.map((token) => token.address!)
  }, [indexTokens])

  const { balances, forceRefetchBalances } = useBalances(
    address,
    indexTokenAddresses,
  )

  const {
    data: { apy, nav, tvl },
    isFetching: isFetchingLatestStats,
  } = useQuery({
    enabled: isAddress(indexTokenAddress),
    initialData: { apy: null, nav: null, tvl: null },
    queryKey: ['token-latest-stats', indexTokenAddress],
    queryFn: async () => {
      const data = await fetchTokenMetrics({
        tokenAddress: indexTokenAddress!,
        metrics: ['nav', 'apy', 'pav'],
      })

      return {
        apy: data?.APY ?? null,
        nav: data?.NetAssetValue ?? null,
        tvl: data?.ProductAssetValue ?? null,
      }
    },
  })

  const {
    data: { apy7d, apy30d },
    isFetching: isFetchingApyStats,
  } = useQuery({
    enabled: isAddress(indexTokenAddress),
    initialData: { apy7d: null, apy30d: null },
    queryKey: ['token-apy-stats', indexTokenAddress],
    queryFn: async () => {
      const data = await fetchTokenHistoricalData({
        tokenAddress: indexTokenAddress!,
        metrics: ['apy'],
        interval: 'daily',
        period: 'month',
      })

      const historicalData = (data ?? []).sort(
        (a, b) =>
          new Date(b.CreatedTimestamp).getTime() -
          new Date(a.CreatedTimestamp).getTime(),
      )

      const apy7d = historicalData
        .slice(0, 7)
        .reduce((acc, current, _, { length }) => {
          return acc + (current.APY ?? 0) / length
        }, 0)

      const apy30d = historicalData
        .slice(0, 30)
        .reduce((acc, current, _, { length }) => {
          return acc + (current.APY ?? 0) / length
        }, 0)

      return {
        apy7d: apy7d || null,
        apy30d: apy30d || null,
      }
    },
  })

  const inputTokenAmount = useMemo(
    () =>
      inputValue === ''
        ? BigInt(0)
        : parseUnits(inputValue, inputToken.decimals),
    [inputToken, inputValue],
  )

  const inputTokens = useMemo(() => {
    if (isMinting) return getCurrencyTokens(chainId)
    return indexTokens
  }, [chainId, indexTokens, isMinting])

  const outputTokens = useMemo(() => {
    if (!isMinting) return getCurrencyTokens(chainId)
    return indexTokens
  }, [chainId, indexTokens, isMinting])

  const transactionReview = useMemo((): TransactionReview | null => {
    if (isFetchingQuote || quoteResult === null) return null
    const quote = quoteResult.quote
    if (quote) {
      return {
        ...quote,
        contractAddress: quote.contract,
        quoteResults: {
          bestQuote: QuoteType.flashmint,
          results: {
            flashmint: quoteResult,
            index: null,
            issuance: null,
            redemption: null,
          },
        },
        selectedQuote: QuoteType.flashmint,
      }
    }
    return null
  }, [isFetchingQuote, quoteResult])

  const toggleIsMinting = useCallback(() => {
    setMinting(!isMinting)
  }, [isMinting])

  useEffect(() => {
    if (inputToken === null || outputToken === null) return

    updateQueryParams({ isMinting, inputToken, outputToken })
  }, [isMinting, inputToken, outputToken, updateQueryParams])

  const onChangeInputTokenAmount = useCallback(
    (input: string) => {
      if (input === '') {
        setInputValue('')
        return
      }
      if (!isValidTokenInput(input, inputToken.decimals)) return
      setInputValue(input || '')
    },
    [inputToken],
  )

  const onSelectInputToken = useCallback(
    (tokenSymbol: string) => {
      const token = inputTokens.find((token) => token.symbol === tokenSymbol)
      if (!token) return
      setInputToken(token)
    },
    [inputTokens],
  )

  const onSelectOutputToken = (tokenSymbol: string) => {
    const token = outputTokens.find((token) => token.symbol === tokenSymbol)
    if (!token) return
    setOutputToken(token)
  }

  const reset = () => {
    setInputValue('')
    setQuoteResult({
      type: QuoteType.flashmint,
      isAvailable: true,
      quote: null,
      error: null,
    })
    forceRefetchBalances()
  }

  useEffect(() => {
    setInputToken(inputTokens[0])
  }, [inputTokens, isMinting])

  useEffect(() => {
    setOutputToken(outputTokens[0])
  }, [outputTokens, isMinting])

  useEffect(() => {
    const fetchSwapQuote = async () => {
      if (!address) return null
      if (!chainId || chainId === ARBITRUM.chainId) return null
      if (!provider || !publicClient) return null
      if (inputTokenAmount <= 0) return null
      if (!indexToken) return null
      const inputTokenPrice = await getTokenPrice(inputToken, chainId)
      const outputTokenPrice = await getTokenPrice(outputToken, chainId)
      const gasPrice = await provider.getGasPrice()
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
        gasPrice,
        provider,
        slippage: 0.1,
      })
    }
    const fetchQuote = async () => {
      if (!address) return null
      if (!chainId) return null
      if (!provider || !publicClient) return null
      if (inputTokenAmount <= 0) return null
      if (!indexToken) return null
      const inputTokenPrice = await getTokenPrice(inputToken, chainId)
      const outputTokenPrice = await getTokenPrice(outputToken, chainId)
      return await getFlashMintQuote(
        {
          isMinting,
          account: address,
          chainId,
          inputToken,
          inputTokenAmount: inputValue,
          inputTokenAmountWei: BigNumber.from(inputTokenAmount.toString()),
          inputTokenPrice,
          outputToken,
          outputTokenPrice,
          nativeTokenPrice,
          slippage: 0.1,
        },
        provider,
        rpcUrl,
      )
    }

    const fetchQuotes = async () => {
      setFetchingQuote(true)
      try {
        const [quoteResult, swapQuoteResult] = await Promise.allSettled([
          fetchQuote(),
          fetchSwapQuote(),
        ])
        setFlashmintQuote(
          quoteResult.status === 'fulfilled' ? quoteResult.value : null,
        )
        setSwapQuote(
          swapQuoteResult.status === 'fulfilled' ? swapQuoteResult.value : null,
        )
      } catch (error) {
        console.error('Error fetching quotes', error)
      } finally {
        setFetchingQuote(false)
      }
    }
    fetchQuotes()
  }, [
    address,
    chainId,
    indexToken,
    inputToken,
    inputTokenAmount,
    inputValue,
    isMinting,
    nativeTokenPrice,
    outputToken,
    provider,
    publicClient,
    rpcUrl,
  ])

  useEffect(() => {
    if (chainId === ARBITRUM.chainId) {
      const quoteResult = {
        type: QuoteType.flashmint,
        isAvailable: true,
        quote: flashmintQuote,
        error: null,
      }
      setQuoteResult(quoteResult)
      return
    }
    const bestQuote = getBestYieldQuote(
      flashmintQuote,
      swapQuote,
      chainId ?? -1,
    )
    setQuoteResult({
      type: bestQuote?.type ?? QuoteType.flashmint,
      isAvailable: true,
      quote: bestQuote,
      error: null,
    })
  }, [chainId, flashmintQuote, swapQuote])

  useEffect(() => {
    // Reset quotes
    setMinting(queryIsMinting)
    setInputToken(queryInputToken)
    setOutputToken(queryOutputToken)
    setQuoteResult({
      type: QuoteType.flashmint,
      isAvailable: true,
      quote: null,
      error: null,
    })
    updateQueryParams({
      isMinting: queryIsMinting,
      inputToken: queryInputToken,
      outputToken: queryOutputToken,
      network: chainId,
    })
  }, [
    chainId,
    queryIsMinting,
    queryInputToken,
    queryOutputToken,
    updateQueryParams,
  ])

  return (
    <YieldContext.Provider
      value={{
        inputValue,
        isMinting,
        balances,
        indexToken,
        indexTokens,
        inputToken,
        outputToken,
        inputTokenAmount,
        apy,
        apy7d,
        apy30d,
        nav,
        tvl,
        inputTokens,
        outputTokens,
        isFetchingQuote,
        isFetchingStats: isFetchingLatestStats || isFetchingApyStats,
        quoteResult,
        stats: null, // FIXME
        transactionReview,
        onChangeInputTokenAmount,
        onSelectInputToken,
        onSelectOutputToken,
        reset,
        toggleIsMinting,
      }}
    >
      {props.children}
    </YieldContext.Provider>
  )
}

function getBestYieldQuote(
  flashmintQuote: Quote | null,
  swapQuote: Quote | null,
  chainId: number,
): Quote | null {
  if (!flashmintQuote && swapQuote) return swapQuote
  if (flashmintQuote && !swapQuote) return flashmintQuote
  if (
    flashmintQuote &&
    flashmintQuote.chainId !== chainId &&
    swapQuote &&
    swapQuote.chainId === chainId
  )
    return swapQuote
  if (
    flashmintQuote &&
    flashmintQuote.chainId === chainId &&
    swapQuote &&
    swapQuote.chainId !== chainId
  )
    return flashmintQuote
  if (flashmintQuote && swapQuote) {
    const bestQuoteType = getBestQuote(
      swapQuote.fullCostsInUsd,
      flashmintQuote.fullCostsInUsd,
      swapQuote.outputTokenAmountUsdAfterFees,
      flashmintQuote.outputTokenAmountUsdAfterFees,
    )
    return bestQuoteType === QuoteType.index ? swapQuote : flashmintQuote
  }
  return null
}
