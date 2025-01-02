'use client'

import { useQuery } from '@tanstack/react-query'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { isAddress } from 'viem'
import { base } from 'viem/chains'

import { useQueryParams } from '@/app/earn/use-query-params'
import { TransactionReview } from '@/components/swap/components/transaction-review/types'
import { ETH, ICUSD, Token } from '@/constants/tokens'
import { TokenBalance, useBalances } from '@/lib/hooks/use-balance'
import { QuoteResult } from '@/lib/hooks/use-best-quote/types'
import { useNetwork } from '@/lib/hooks/use-network'
import { useQuoteResult } from '@/lib/hooks/use-quote-result'
import { useTransactionReview } from '@/lib/hooks/use-transaction-review'
import { useWallet } from '@/lib/hooks/use-wallet'
import { isValidTokenInput, parseUnits } from '@/lib/utils'
import {
  fetchTokenHistoricalData,
  fetchTokenMetrics,
} from '@/lib/utils/api/index-data-provider'

import { getCurrencyTokens, getYieldTokens } from './constants'

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
  transactionReview: TransactionReview | null
  onChangeInputTokenAmount: (input: string) => void
  onSelectIndexToken: (tokenSymbol: string, chainId: number) => void
  onSelectInputToken: (tokenSymbol: string, chainId: number) => void
  onSelectOutputToken: (tokenSymbol: string, chainId: number) => void
  reset: () => void
  toggleIsMinting: () => void
}

export const EarnContext = createContext<Context>({
  inputValue: '',
  isMinting: true,
  balances: [],
  indexToken: ICUSD,
  indexTokens: [],
  apy: null,
  apy7d: null,
  apy30d: null,
  nav: null,
  tvl: null,
  inputToken: ETH,
  outputToken: ICUSD,
  inputTokenAmount: BigInt(0),
  inputTokens: [],
  outputTokens: [],
  isFetchingQuote: false,
  isFetchingStats: true,
  quoteResult: null,
  transactionReview: null,
  onChangeInputTokenAmount: () => {},
  onSelectIndexToken: () => {},
  onSelectInputToken: () => {},
  onSelectOutputToken: () => {},
  reset: () => {},
  toggleIsMinting: () => {},
})

export const useEarnContext = () => useContext(EarnContext)

const defaultParams = {
  isMinting: true,
  inputToken: ETH,
  outputToken: ICUSD,
}

export function EarnProvider(props: { children: any }) {
  const { chainId: chainIdRaw } = useNetwork()
  const { address } = useWallet()
  const {
    queryParams: { queryInputToken, queryOutputToken, queryIsMinting },
    updateQueryParams,
  } = useQueryParams({ ...defaultParams, network: chainIdRaw })

  const [inputValue, setInputValue] = useState('')

  const isMinting = queryIsMinting
  const inputToken = queryInputToken
  const outputToken = queryOutputToken

  const chainId = useMemo(() => {
    return chainIdRaw ?? base.id
  }, [chainIdRaw])

  const indexToken = useMemo(() => {
    if (isMinting) return outputToken
    return inputToken
  }, [inputToken, isMinting, outputToken])

  const indexTokenAddress = indexToken.address ?? ''

  const indexTokens = useMemo(() => {
    return getYieldTokens()
  }, [])

  const indexTokenAddresses = useMemo(() => {
    return indexTokens.map((token) => token.address!)
  }, [indexTokens])

  const { balances, forceRefetchBalances } = useBalances(
    address,
    indexTokenAddresses,
  )

  const inputTokens = useMemo(() => {
    if (isMinting) return getCurrencyTokens(chainId)
    return indexTokens
  }, [chainId, indexTokens, isMinting])

  const outputTokens = useMemo(() => {
    if (!isMinting) return getCurrencyTokens(chainId)
    return indexTokens
  }, [chainId, indexTokens, isMinting])

  const inputTokenAmount = useMemo(
    () =>
      inputValue === ''
        ? BigInt(0)
        : parseUnits(inputValue, inputToken.decimals),
    [inputToken, inputValue],
  )

  const { isFetchingQuote, quoteResult, resetQuote } = useQuoteResult({
    address,
    chainId,
    isMinting,
    inputToken,
    outputToken,
    inputTokenAmount,
    inputValue,
  })
  const transactionReview = useTransactionReview(isFetchingQuote, quoteResult)

  const {
    data: { apy, nav, tvl },
    isFetching: isFetchingLatestStats,
  } = useQuery({
    enabled: isAddress(indexTokenAddress),
    gcTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
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
    gcTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
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
    (tokenSymbol: string, chainId: number) => {
      const token = inputTokens.find(
        (token) => token.symbol === tokenSymbol && token.chainId === chainId,
      )
      if (!token) return
      updateQueryParams({
        isMinting,
        inputToken: token,
        outputToken,
        network: chainId,
      })
    },
    [inputTokens, isMinting, outputToken, updateQueryParams],
  )

  const onSelectOutputToken = useCallback(
    (tokenSymbol: string, chainId: number) => {
      const token = outputTokens.find(
        (token) => token.symbol === tokenSymbol && token.chainId === chainId,
      )
      if (!token) return
      updateQueryParams({
        isMinting,
        inputToken,
        outputToken: token,
        network: chainId,
      })
    },
    [outputTokens, isMinting, inputToken, updateQueryParams],
  )

  const onSelectIndexToken = useCallback(
    (tokenSymbol: string, chainId: number) => {
      if (isMinting) {
        onSelectOutputToken(tokenSymbol, chainId)
      } else {
        onSelectInputToken(tokenSymbol, chainId)
      }
    },
    [isMinting, onSelectInputToken, onSelectOutputToken],
  )

  const reset = () => {
    setInputValue('')
    resetQuote()
    forceRefetchBalances()
  }

  const toggleIsMinting = useCallback(() => {
    updateQueryParams({
      isMinting,
      inputToken: outputToken,
      outputToken: inputToken,
      network: chainId,
    })
  }, [chainId, isMinting, inputToken, outputToken, updateQueryParams])

  return (
    <EarnContext.Provider
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
        transactionReview,
        onChangeInputTokenAmount,
        onSelectIndexToken,
        onSelectInputToken,
        onSelectOutputToken,
        reset,
        toggleIsMinting,
      }}
    >
      {props.children}
    </EarnContext.Provider>
  )
}
