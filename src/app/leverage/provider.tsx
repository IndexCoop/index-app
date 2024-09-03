'use client'

import { BigNumber } from 'ethers'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { usePublicClient } from 'wagmi'

import { TransactionReview } from '@/components/swap/components/transaction-review/types'
import { ARBITRUM } from '@/constants/chains'
import { ETH, IndexCoopEthereum2xIndex, Token } from '@/constants/tokens'
import { TokenBalance, useBalances } from '@/lib/hooks/use-balance'
import { Quote, QuoteResult, QuoteType } from '@/lib/hooks/use-best-quote/types'
import { getBestQuote } from '@/lib/hooks/use-best-quote/utils/best-quote'
import { getFlashMintQuote } from '@/lib/hooks/use-best-quote/utils/flashmint'
import { getIndexQuote } from '@/lib/hooks/use-best-quote/utils/index-quote'
import { useNetwork } from '@/lib/hooks/use-network'
import { getTokenPrice, useNativeTokenPrice } from '@/lib/hooks/use-token-price'
import { publicClientToProvider, useWallet } from '@/lib/hooks/use-wallet'
import { isValidTokenInput, parseUnits } from '@/lib/utils'
import { IndexApi } from '@/lib/utils/api/index-api'
import { NavProvider } from '@/lib/utils/api/nav'
import { fetchCostOfCarry } from '@/lib/utils/fetch-cost-of-carry'

import {
  getBaseTokens,
  getCurrencyTokens,
  getLeverageTokens,
  supportedLeverageTypes,
} from './constants'
import { BaseTokenStats, LeverageType } from './types'
import { getLeverageType } from './utils/get-leverage-type'

export interface TokenContext {
  inputValue: string
  isMinting: boolean
  leverageType: LeverageType
  balances: TokenBalance[]
  baseToken: Token
  indexToken: Token
  indexTokenPrice: number
  inputToken: Token
  outputToken: Token
  inputTokenAmount: bigint
  baseTokens: Token[]
  costOfCarry: number | null
  inputTokens: Token[]
  outputTokens: Token[]
  isFetchingQuote: boolean
  quoteResult: QuoteResult | null
  stats: BaseTokenStats | null
  supportedLeverageTypes: LeverageType[]
  transactionReview: TransactionReview | null
  onChangeInputTokenAmount: (input: string) => void
  onSelectBaseToken: (tokenSymbol: string) => void
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
  indexToken: IndexCoopEthereum2xIndex,
  indexTokenPrice: 0,
  inputToken: ETH,
  outputToken: IndexCoopEthereum2xIndex,
  inputTokenAmount: BigInt(0),
  baseTokens: [],
  costOfCarry: null,
  inputTokens: [],
  outputTokens: [],
  isFetchingQuote: false,
  quoteResult: null,
  stats: null,
  supportedLeverageTypes: [],
  transactionReview: null,
  onChangeInputTokenAmount: () => {},
  onSelectBaseToken: () => {},
  onSelectInputToken: () => {},
  onSelectLeverageType: () => {},
  onSelectOutputToken: () => {},
  reset: () => {},
  toggleIsMinting: () => {},
})

export const useLeverageToken = () => useContext(LeverageTokenContext)

export function LeverageProvider(props: { children: any }) {
  const publicClient = usePublicClient()
  const { chainId: chainIdRaw } = useNetwork()
  const nativeTokenPrice = useNativeTokenPrice(chainIdRaw)
  const { address, provider, rpcUrl } = useWallet()

  const [baseToken, setBaseToken] = useState<Token>(ETH)
  // Use leverage type 2x because it exists on all chains
  const [leverageType, setLeverageType] = useState<LeverageType>(
    LeverageType.Long2x,
  )

  const [inputValue, setInputValue] = useState('')
  const [costOfCarry, setCostOfCarry] = useState<number | null>(null)
  const [indexTokenPrice, setIndexTokenPrice] = useState(0)
  const [isFetchingQuote, setFetchingQuote] = useState(false)
  const [isMinting, setMinting] = useState<boolean>(true)
  const [inputToken, setInputToken] = useState<Token>(ETH)
  const [outputToken, setOutputToken] = useState<Token>(
    IndexCoopEthereum2xIndex,
  )
  const [stats, setStats] = useState<BaseTokenStats | null>(null)
  const [flashmintQuote, setFlashmintQuote] = useState<Quote | null>(null)
  const [swapQuote, setSwapQuote] = useState<Quote | null>(null)
  const [quoteResult, setQuoteResult] = useState<QuoteResult>({
    type: QuoteType.flashmint,
    isAvailable: true,
    quote: null,
    error: null,
  })

  const chainId = useMemo(() => {
    // To control the defaults better
    return chainIdRaw ?? ARBITRUM.chainId
  }, [chainIdRaw])

  const baseTokens = useMemo(() => {
    return getBaseTokens(chainId)
  }, [chainId])

  const indexToken = useMemo(() => {
    if (isMinting) return outputToken
    return inputToken
  }, [inputToken, isMinting, outputToken])

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

  const indexTokenBasedOnLeverageType = useMemo(() => {
    return indexTokens.find(
      (token) =>
        token.baseToken === baseToken.symbol &&
        token.leverageType === leverageType,
    )!
  }, [baseToken, indexTokens, leverageType])

  const indexTokensBasedOnSymbol = useMemo(() => {
    return indexTokens.filter((token) => {
      return token.baseToken === baseToken.symbol
    })
  }, [baseToken, indexTokens])

  const inputTokenAmount = useMemo(
    () =>
      inputValue === ''
        ? BigInt(0)
        : parseUnits(inputValue, inputToken.decimals),
    [inputToken, inputValue],
  )

  const inputTokens = useMemo(() => {
    if (isMinting) return getCurrencyTokens(chainId)
    return indexTokensBasedOnSymbol
  }, [chainId, indexTokensBasedOnSymbol, isMinting])

  const outputTokens = useMemo(() => {
    if (!isMinting) return getCurrencyTokens(chainId)
    return indexTokensBasedOnSymbol
  }, [chainId, indexTokensBasedOnSymbol, isMinting])

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
    const fetchStats = async () => {
      try {
        const indexApi = new IndexApi()
        const res = await indexApi.get(`/token/${baseToken.symbol}`)
        setStats(res.data)
      } catch (err) {
        console.log('Error fetching token stats', err)
      }
    }
    fetchStats()
  }, [baseToken])

  useEffect(() => {
    const fetchPrice = async () => {
      const navProvider = new NavProvider()
      const navPrice = await navProvider.getNavPrice(indexToken.symbol, chainId)
      setIndexTokenPrice(navPrice)
    }
    fetchPrice()
  }, [chainId, indexToken])

  useEffect(() => {
    if (!publicClient || inputToken === null || outputToken === null) return

    const jsonRpcProvider = publicClientToProvider(publicClient)
    const inputOutputToken = isMinting ? outputToken : inputToken
    fetchCostOfCarry(jsonRpcProvider, inputOutputToken, setCostOfCarry)
  }, [publicClient, isMinting, inputToken, outputToken])

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

  const onSelectLeverageType = (type: LeverageType) => {
    setLeverageType(type)
  }

  const onSelectInputToken = useCallback(
    (tokenSymbol: string) => {
      const token = inputTokens.find((token) => token.symbol === tokenSymbol)
      if (!token) return
      setInputToken(token)
      const leverageType = getLeverageType(token.symbol)
      if (leverageType !== null) {
        setLeverageType(leverageType)
      }
    },
    [inputTokens],
  )

  const onSelectBaseToken = (tokenSymbol: string) => {
    const token = baseTokens.find((token) => token.symbol === tokenSymbol)
    if (!token) return
    setBaseToken(token)
  }

  const onSelectOutputToken = (tokenSymbol: string) => {
    const token = outputTokens.find((token) => token.symbol === tokenSymbol)
    if (!token) return
    setOutputToken(token)
    const leverageType = getLeverageType(token.symbol)
    if (leverageType !== null) {
      setLeverageType(leverageType)
    }
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
    const indexToken = indexTokenBasedOnLeverageType
    if (isMinting) {
      setOutputToken(indexToken)
      return
    }
    setInputToken(indexToken)
  }, [indexTokenBasedOnLeverageType, isMinting, leverageType])

  useEffect(() => {
    const fetchSwapQuote = async () => {
      if (!address) return
      if (!chainId) return
      if (!provider || !publicClient) return
      if (inputTokenAmount <= 0) return
      if (!indexToken) return
      setFetchingQuote(true)
      try {
        const inputTokenPrice = await getTokenPrice(inputToken, chainId)
        const outputTokenPrice = await getTokenPrice(outputToken, chainId)
        const gasPrice = await provider.getGasPrice()
        const swapQuote = await getIndexQuote({
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
        setSwapQuote(swapQuote)
        setFetchingQuote(false)
      } catch (e) {
        console.error('Error getting swap quote', e)
        setFetchingQuote(false)
        throw e
      }
    }
    const fetchQuote = async () => {
      if (!address) return
      if (!chainId) return
      if (!provider || !publicClient) return
      if (inputTokenAmount <= 0) return
      if (!indexToken) return
      setFetchingQuote(true)
      const inputTokenPrice = await getTokenPrice(inputToken, chainId)
      const outputTokenPrice = await getTokenPrice(outputToken, chainId)
      const quoteFlashMint = await getFlashMintQuote(
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
      setFlashmintQuote(quoteFlashMint)
      setFetchingQuote(false)
    }
    fetchQuote()
    fetchSwapQuote()
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
    const bestQuote = getBestLeverageQuote(
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
    setMinting(true)
    setBaseToken(ETH)
    setInputToken(ETH)
    setOutputToken(IndexCoopEthereum2xIndex)
    setLeverageType(LeverageType.Long2x)
    setQuoteResult({
      type: QuoteType.flashmint,
      isAvailable: true,
      quote: null,
      error: null,
    })
  }, [chainId])

  return (
    <LeverageTokenContext.Provider
      value={{
        inputValue,
        isMinting,
        leverageType,
        balances,
        baseToken,
        indexToken,
        indexTokenPrice,
        inputToken,
        outputToken,
        inputTokenAmount,
        baseTokens,
        costOfCarry,
        inputTokens,
        outputTokens,
        isFetchingQuote,
        quoteResult,
        stats,
        supportedLeverageTypes: supportedLeverageTypes[chainId],
        transactionReview,
        onChangeInputTokenAmount,
        onSelectBaseToken,
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
