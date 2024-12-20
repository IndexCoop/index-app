'use client'

import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { useQuery } from '@tanstack/react-query'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { isAddress } from 'viem'
import { arbitrum } from 'viem/chains'
import { usePublicClient } from 'wagmi'

import { getLeverageBaseToken } from '@/app/leverage/utils/get-leverage-base-token'
import { TransactionReview } from '@/components/swap/components/transaction-review/types'
import { ARBITRUM } from '@/constants/chains'
import { ETH, Token } from '@/constants/tokens'
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
import { IndexApi } from '@/lib/utils/api/index-api'
import { fetchTokenMetrics } from '@/lib/utils/api/index-data-provider'
import { fetchCarryCosts } from '@/lib/utils/fetch'

import {
  getCurrencyTokens,
  getLeverageTokens,
  supportedLeverageTypes,
} from './constants'
import { BaseTokenStats, LeverageToken, LeverageType } from './types'

const eth2x = getTokenByChainAndSymbol(1, 'ETH2X')

export interface TokenContext {
  inputValue: string
  isMinting: boolean
  leverageType: LeverageType
  balances: TokenBalance[]
  baseToken: Token
  indexToken: Token
  indexTokens: Token[]
  market: string
  nav: number
  navchange: number
  inputToken: Token
  outputToken: Token
  inputTokenAmount: bigint
  costOfCarry: number | null
  inputTokens: Token[]
  outputTokens: Token[]
  isFetchingQuote: boolean
  isFetchingStats: boolean
  quoteResult: QuoteResult | null
  stats: BaseTokenStats | null
  supportedLeverageTypes: LeverageType[]
  transactionReview: TransactionReview | null
  onChangeInputTokenAmount: (input: string) => void
  onSelectInputToken: (tokenSymbol: string) => void
  onSelectLeverageType: (type: LeverageType) => void
  onSelectOutputToken: (tokenSymbol: string) => void
  reset: () => void
  toggleIsMinting: () => void
}

export const LeverageTokenContext = createContext<TokenContext>({
  inputValue: '',
  isMinting: true,
  leverageType: LeverageType.Long2x,
  balances: [],
  baseToken: ETH,
  indexToken: { ...eth2x, image: eth2x.logoURI },
  indexTokens: [],
  market: 'ETH / USD',
  nav: 0,
  navchange: 0,
  inputToken: ETH,
  outputToken: { ...eth2x, image: eth2x.logoURI },
  inputTokenAmount: BigInt(0),
  costOfCarry: null,
  inputTokens: [],
  outputTokens: [],
  isFetchingQuote: false,
  isFetchingStats: false,
  quoteResult: null,
  stats: null,
  supportedLeverageTypes: [],
  transactionReview: null,
  onChangeInputTokenAmount: () => {},
  onSelectInputToken: () => {},
  onSelectLeverageType: () => {},
  onSelectOutputToken: () => {},
  reset: () => {},
  toggleIsMinting: () => {},
})

export const useLeverageToken = () => useContext(LeverageTokenContext)

const defaultParams = {
  baseToken: ETH,
  isMinting: true,
  leverageType: LeverageType.Long2x,
  inputToken: ETH,
  outputToken: {
    ...eth2x,
    image: eth2x.logoURI,
    leverageType: LeverageType.Long2x,
    baseToken: ETH.symbol,
  } as LeverageToken,
}

export function LeverageProvider(props: { children: any }) {
  const { chainId: chainIdRaw } = useNetwork()
  const nativeTokenPrice = useNativeTokenPrice(chainIdRaw)
  const { address } = useWallet()
  const {
    queryParams: {
      queryBaseToken,
      queryLeverageType,
      queryInputToken,
      queryOutputToken,
      queryIsMinting,
    },
    updateQueryParams,
  } = useQueryParams({ ...defaultParams, network: chainIdRaw })

  const publicClient = usePublicClient({ chainId: chainIdRaw })

  const [inputValue, setInputValue] = useState('')
  const [carryCosts, setCarryCosts] = useState<Record<string, number> | null>(
    null,
  )
  const [costOfCarry, setCostOfCarry] = useState<number | null>(null)
  const [isFetchingStats, setFetchingStats] = useState(true)
  const [stats, setStats] = useState<BaseTokenStats | null>(null)
  const [quoteResult, setQuoteResult] = useState<QuoteResult>({
    type: QuoteType.flashmint,
    isAvailable: true,
    quote: null,
    error: null,
  })

  const isMinting = queryIsMinting
  const inputToken = queryInputToken
  const outputToken = queryOutputToken
  const baseToken = queryBaseToken

  const chainId = useMemo(() => {
    return chainIdRaw ?? ARBITRUM.chainId
  }, [chainIdRaw])

  const indexToken = useMemo(() => {
    if (isMinting) return outputToken
    return inputToken
  }, [inputToken, isMinting, outputToken])

  const indexTokenAddress = useMemo(() => {
    return getTokenByChainAndSymbol(chainId, indexToken.symbol)?.address ?? ''
  }, [chainId, indexToken.symbol])

  const indexTokens = useMemo(() => {
    return getLeverageTokens(chainId)
  }, [chainId])

  const indexTokenAddresses = useMemo(() => {
    return indexTokens.map((token) => token.address!)
  }, [indexTokens])

  const { balances, forceRefetchBalances } = useBalances(
    address,
    indexTokenAddresses,
  )

  const {
    data: { nav, navchange },
  } = useQuery({
    enabled: isAddress(indexTokenAddress),
    initialData: { nav: 0, navchange: 0 },
    queryKey: ['token-nav', indexTokenAddress],
    queryFn: async () => {
      const data = await fetchTokenMetrics({
        tokenAddress: indexTokenAddress!,
        metrics: ['nav', 'navchange'],
      })

      return {
        nav: data?.NetAssetValue ?? 0,
        navchange: (data?.NavChange24Hr ?? 0) * 100,
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

  const indexTokensBasedOnSymbol = useMemo(() => {
    return indexTokens.filter((token) => {
      return token.baseToken === baseToken.symbol
    })
  }, [baseToken, indexTokens])

  const inputTokens = useMemo(() => {
    if (isMinting) return getCurrencyTokens(chainId)
    return indexTokensBasedOnSymbol
  }, [chainId, indexTokensBasedOnSymbol, isMinting])

  const outputTokens = useMemo(() => {
    if (!isMinting) return getCurrencyTokens(chainId)
    return indexTokensBasedOnSymbol
  }, [chainId, indexTokensBasedOnSymbol, isMinting])

  const market = useMemo(() => {
    if (
      indexToken.symbol ===
      getTokenByChainAndSymbol(arbitrum.id, 'ETH2xBTC').symbol
    )
      return 'ETH / BTC'
    if (
      indexToken.symbol ===
      getTokenByChainAndSymbol(arbitrum.id, 'BTC2xETH').symbol
    )
      return 'BTC / ETH'
    return baseToken.symbol === ETH.symbol ? 'ETH / USD' : 'BTC / USD'
  }, [baseToken, indexToken])

  const toggleIsMinting = useCallback(() => {
    updateQueryParams({
      isMinting,
      inputToken: outputToken,
      outputToken: inputToken,
      network: chainId,
    })
  }, [chainId, isMinting, inputToken, outputToken, updateQueryParams])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setFetchingStats(true)
        const indexApi = new IndexApi()
        const res = await indexApi.get(`/token/${baseToken.symbol}`)
        setStats(res.data)
      } catch (err) {
        console.warn('Error fetching token stats', err)
      }
      setFetchingStats(false)
    }
    fetchStats()
  }, [baseToken])

  useEffect(() => {
    async function fetchCosts() {
      const carryCosts = await fetchCarryCosts()
      setCarryCosts(carryCosts)
    }

    fetchCosts()
  }, [])

  useEffect(() => {
    const inputOutputToken = isMinting ? outputToken : inputToken
    if (!inputOutputToken) return
    if (carryCosts)
      setCostOfCarry(carryCosts[inputOutputToken.symbol.toLowerCase()] ?? null)
  }, [isMinting, inputToken, outputToken, carryCosts])

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

  const onSelectLeverageType = useCallback(
    (type: LeverageType) => {
      const currentBase = getLeverageBaseToken(indexToken.symbol)?.symbol
      const leverageTokens = getLeverageTokens(chainId).filter(
        (leverageToken) => leverageToken.baseToken === currentBase,
      )
      const selectedLeverageToken = leverageTokens.find(
        (token) => token.leverageType === type,
      )
      updateQueryParams({
        isMinting,
        inputToken: isMinting ? inputToken : selectedLeverageToken,
        outputToken: isMinting ? selectedLeverageToken : outputToken,
        network: chainId,
      })
    },
    [
      chainId,
      indexToken,
      inputToken,
      outputToken,
      isMinting,
      updateQueryParams,
    ],
  )

  const onSelectInputToken = useCallback(
    (tokenSymbol: string) => {
      const inputTokens = isMinting ? getCurrencyTokens(chainId) : indexTokens
      const token = inputTokens.find((token) => token.symbol === tokenSymbol)
      if (!token) return
      updateQueryParams({
        isMinting,
        inputToken: token,
        outputToken,
        network: chainId,
      })
    },
    [chainId, indexTokens, outputToken, isMinting, updateQueryParams],
  )

  const onSelectOutputToken = useCallback(
    (tokenSymbol: string) => {
      const outputTokens = isMinting ? indexTokens : getCurrencyTokens(chainId)
      const token = outputTokens.find((token) => token.symbol === tokenSymbol)
      if (!token) return
      updateQueryParams({
        isMinting,
        inputToken,
        outputToken: token,
        network: chainId,
      })
    },
    [chainId, indexTokens, inputToken, isMinting, updateQueryParams],
  )

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
      slippage: 0.1,
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
        inputTokenAmount > 0, // Condition to trigger
    })

  const fetchSwapQuote = async () => {
    if (!address) return null
    if (!chainId || chainId === ARBITRUM.chainId) return null
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

  const isFetchingQuote = isFetchingFlashMintQuote || isFetchingSwapQuote

  useEffect(() => {
    const bestQuote = getBestLeverageQuote(
      flashmintQuote ?? null,
      swapQuote ?? null,
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
    setQuoteResult({
      type: QuoteType.flashmint,
      isAvailable: true,
      quote: null,
      error: null,
    })
  }, [
    chainId,
    queryIsMinting,
    queryInputToken,
    queryOutputToken,
    queryLeverageType,
  ])

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

  const isRatioToken = useMemo(() => {
    const eth2xBtc = getTokenByChainAndSymbol(chainId, 'ETH2xBTC')
    const btc2xEth = getTokenByChainAndSymbol(chainId, 'BTC2xETH')
    return (
      indexToken.symbol === eth2xBtc?.symbol ||
      indexToken.symbol === btc2xEth?.symbol
    )
  }, [chainId, indexToken])

  return (
    <LeverageTokenContext.Provider
      value={{
        inputValue,
        isMinting,
        leverageType: queryLeverageType,
        balances,
        baseToken,
        indexToken,
        indexTokens,
        inputToken,
        outputToken,
        inputTokenAmount,
        market,
        nav,
        navchange,
        costOfCarry,
        inputTokens,
        outputTokens,
        isFetchingQuote,
        isFetchingStats,
        quoteResult,
        stats,
        supportedLeverageTypes: isRatioToken
          ? [LeverageType.Long2x]
          : supportedLeverageTypes[chainId],
        transactionReview,
        onChangeInputTokenAmount,
        onSelectInputToken,
        onSelectLeverageType,
        onSelectOutputToken,
        reset,
        toggleIsMinting,
      }}
    >
      {props.children}
    </LeverageTokenContext.Provider>
  )
}

function getBestLeverageQuote(
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
