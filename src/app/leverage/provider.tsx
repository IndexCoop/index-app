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
import { arbitrum, base } from 'viem/chains'

import { getLeverageBaseToken } from '@/app/leverage/utils/get-leverage-base-token'
import { ARBITRUM } from '@/constants/chains'
import { ETH, type Token } from '@/constants/tokens'
import { useAnalytics } from '@/lib/hooks/use-analytics'
import { type TokenBalance, useBalances } from '@/lib/hooks/use-balance'
import { useNetwork } from '@/lib/hooks/use-network'
import { useQueryParams } from '@/lib/hooks/use-query-params'
import { useQuoteResult } from '@/lib/hooks/use-quote-result'
import { useSimulateQuote } from '@/lib/hooks/use-simulate-quote'
import { useUtmParams } from '@/lib/hooks/use-utm-params'
import { useWallet } from '@/lib/hooks/use-wallet'
import { useSlippage } from '@/lib/providers/slippage'
import { isValidTokenInput, parseUnits } from '@/lib/utils'

import {
  getCurrencyTokens,
  getLeverageTokens,
  markets,
  supportedLeverageTypes,
} from './constants'
import { type LeverageToken, LeverageType, type Market } from './types'

import type { QuoteResult } from '@/lib/hooks/use-best-quote/types'

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
  marketData: Market[]
  inputToken: Token
  outputToken: Token
  inputTokenAmount: bigint
  inputTokens: Token[]
  outputTokens: Token[]
  isFetchingQuote: boolean
  quoteResult: QuoteResult | null
  supportedLeverageTypes: LeverageType[]
  onChangeInputTokenAmount: (input: string) => void
  onSelectInputToken: (tokenSymbol: string) => void
  onSelectLeverageType: (type: LeverageType) => void
  onSelectOutputToken: (tokenSymbol: string) => void
  reset: () => void
  refetchQuote:
    | ReturnType<typeof useQuoteResult>['refetchQuote']
    | (() => Promise<void>)
  toggleIsMinting: (force?: boolean) => void
}

const LeverageTokenContext = createContext<TokenContext>({
  inputValue: '',
  isMinting: true,
  leverageType: LeverageType.Long2x,
  balances: [],
  baseToken: ETH,
  indexToken: { ...eth2x, image: eth2x.logoURI },
  indexTokens: [],
  market: 'ETH / USD',
  marketData: [],
  inputToken: ETH,
  outputToken: { ...eth2x, image: eth2x.logoURI },
  inputTokenAmount: BigInt(0),
  inputTokens: [],
  outputTokens: [],
  isFetchingQuote: false,
  quoteResult: null,
  supportedLeverageTypes: [],
  onChangeInputTokenAmount: () => {},
  onSelectInputToken: () => {},
  onSelectLeverageType: () => {},
  onSelectOutputToken: () => {},
  reset: () => {},
  refetchQuote: async () => {},
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
  const { logEvent } = useAnalytics()
  const { chainId: chainIdRaw } = useNetwork()
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
  const { slippage, setProductToken } = useSlippage()
  const utm = useUtmParams()

  const [inputValue, setInputValue] = useState('')

  const isMinting = queryIsMinting
  const inputToken = queryInputToken
  const outputToken = queryOutputToken
  const baseToken = queryBaseToken

  const chainId = useMemo(() => {
    return chainIdRaw ?? ARBITRUM.chainId
  }, [chainIdRaw])

  const indexToken = useMemo(() => {
    return isMinting ? outputToken : inputToken
  }, [inputToken, isMinting, outputToken])

  useEffect(() => {
    if (!indexToken.address || !indexToken.chainId) return
    setProductToken(
      {
        address: indexToken.address as `0x${string}`,
        chainId: indexToken.chainId,
      },
      isMinting,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexToken, isMinting])

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

  const inputTokenAmount = useMemo(
    () =>
      inputValue === ''
        ? BigInt(0)
        : parseUnits(inputValue, inputToken.decimals),
    [inputToken, inputValue],
  )

  const { isFetchingQuote, quoteResult, refetchQuote } = useQuoteResult({
    address,
    chainId,
    isMinting,
    inputToken,
    outputToken,
    inputTokenAmount,
    inputValue,
    slippage,
  })

  const { simulateTrade } = useSimulateQuote(quoteResult?.quote?.tx ?? null)

  useEffect(() => {
    const simulate = async () => {
      const quote = quoteResult?.quote
      if (!quote) return
      const result = await simulateTrade()
      logEvent('simulate_trade', {
        result: result.success,
        reason: result.simulation.errorMessage ?? '',
        account: address,
        chainId: quote.chainId,
        inputToken: quote.inputToken.symbol,
        outputToken: quote.outputToken.symbol,
        inputTokenAmount: quote.inputTokenAmount.toString(),
        outputTokenAmount: quote.outputTokenAmount.toString(),
        inputTokenAmountUsd: quote.inputTokenAmountUsd,
        outputTokenAmountUsd: quote.outputTokenAmountUsd,
        priceImpactUsd: quote.priceImpactUsd,
        priceImpactPercent: quote.priceImpactPercent,
        slippage: quote.slippage,
        utmSource: utm.utm_source ?? '',
      })
    }
    simulate()
  }, [address, logEvent, quoteResult, simulateTrade, utm.utm_source])

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
    if (indexToken.symbol === 'AAVE2x') return 'AAVE / USD'
    if (indexToken.symbol === 'ARB2x') return 'ARB / USD'
    if (indexToken.symbol === 'LINK2x') return 'LINK / USD'
    if (indexToken.symbol === 'GOLD3x') return 'XAUT / USD'
    if (
      indexToken.symbol ===
        getTokenByChainAndSymbol(base.id, 'uSOL2x').symbol ||
      indexToken.symbol === getTokenByChainAndSymbol(base.id, 'uSOL3x').symbol
    ) {
      return 'SOL / USD'
    }
    if (
      indexToken.symbol ===
        getTokenByChainAndSymbol(base.id, 'uSUI2x').symbol ||
      indexToken.symbol === getTokenByChainAndSymbol(base.id, 'uSUI3x').symbol
    ) {
      return 'SUI / USD'
    }
    if (
      indexToken.symbol ===
        getTokenByChainAndSymbol(base.id, 'uXRP2x').symbol ||
      indexToken.symbol === getTokenByChainAndSymbol(base.id, 'uXRP3x').symbol
    ) {
      return 'XRP / USD'
    }
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

  const getSupportedLeverageTypes = useMemo(() => {
    const eth2xBtc = getTokenByChainAndSymbol(chainId, 'ETH2xBTC')
    const btc2xEth = getTokenByChainAndSymbol(chainId, 'BTC2xETH')

    const isRatioToken =
      indexToken.symbol === eth2xBtc?.symbol ||
      indexToken.symbol === btc2xEth?.symbol

    return isRatioToken
      ? [LeverageType.Long2x]
      : supportedLeverageTypes[chainId]
  }, [chainId, indexToken])

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

  const { data: marketData } = useQuery({
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: false,
    initialData: [],
    queryKey: ['market-selector'],
    queryFn: async () => {
      const marketResponses = await Promise.all(
        markets.map((item) => {
          return fetch(
            `/api/markets?symbol=${item.symbol}&currency=${item.currency}`,
          )
        }),
      )

      const marketData: Market[] = await Promise.all(
        marketResponses.map((response) => response.json()),
      )

      return markets.map((market, idx) => ({
        ...market,
        ...marketData[idx],
      }))
    },
  })

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
        marketData,
        inputTokens,
        outputTokens,
        isFetchingQuote,
        quoteResult,
        supportedLeverageTypes: getSupportedLeverageTypes,
        onChangeInputTokenAmount,
        onSelectInputToken,
        onSelectLeverageType,
        onSelectOutputToken,
        reset,
        refetchQuote,
        toggleIsMinting,
      }}
    >
      {props.children}
    </LeverageTokenContext.Provider>
  )
}
