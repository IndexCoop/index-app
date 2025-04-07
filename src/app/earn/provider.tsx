'use client'

import { getTokenByChainAndSymbol, isAddressEqual } from '@indexcoop/tokenlists'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import * as chains from 'viem/chains'

import { useQueryParams } from '@/app/earn-old/use-query-params'
import { ETH, type Token } from '@/constants/tokens'
import { useMultiChainBalances } from '@/lib/hooks/use-multichain-balances'
import { useNetwork } from '@/lib/hooks/use-network'
import { useQuoteResult } from '@/lib/hooks/use-quote-result'
import { useWallet } from '@/lib/hooks/use-wallet'
import { useSlippage } from '@/lib/providers/slippage'
import { isValidTokenInput, parseUnits } from '@/lib/utils'

import { getCurrencyTokens, getYieldTokens } from './constants'

import type { GetApiV2ProductsEarn200 } from '@/gen'
import type { TokenBalance } from '@/lib/hooks/use-balance'
import type { QuoteResult } from '@/lib/hooks/use-best-quote/types'

const hyEthTokenlist = getTokenByChainAndSymbol(1, 'hyETH')
const hyETH = { ...hyEthTokenlist, image: hyEthTokenlist.logoURI }
const icETH = getTokenByChainAndSymbol(1, 'icETH')

interface Context {
  inputValue: string
  isMinting: boolean
  balances: TokenBalance[]
  indexToken: Token
  indexTokens: Token[]
  products: GetApiV2ProductsEarn200
  inputToken: Token
  outputToken: Token
  inputTokenAmount: bigint
  inputTokens: Token[]
  outputTokens: Token[]
  isFetchingQuote: boolean
  quoteResult: QuoteResult | null
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
  indexToken: hyETH,
  indexTokens: [],
  products: [],
  inputToken: ETH,
  outputToken: hyETH,
  inputTokenAmount: BigInt(0),
  inputTokens: [],
  outputTokens: [],
  isFetchingQuote: false,
  quoteResult: null,
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
  outputToken: hyETH,
}

export function EarnProvider(props: {
  children: any
  products: GetApiV2ProductsEarn200
}) {
  const { chainId: chainIdRaw } = useNetwork()
  const { address } = useWallet()
  const {
    queryParams: { queryInputToken, queryOutputToken, queryIsMinting },
    updateQueryParams,
  } = useQueryParams({ ...defaultParams, network: chainIdRaw })
  const { slippage } = useSlippage()

  const [inputValue, setInputValue] = useState('')

  const inputToken = queryInputToken
  const outputToken = queryOutputToken

  const chainId = useMemo(() => {
    return chainIdRaw ?? chains.base.id
  }, [chainIdRaw])

  const indexToken = useMemo(() => {
    if (queryIsMinting) return outputToken
    return inputToken
  }, [inputToken, queryIsMinting, outputToken])

  const indexTokens = useMemo(() => {
    return getYieldTokens()
  }, [])

  const isMinting: boolean = useMemo(() => {
    const isIcEth = isAddressEqual(indexToken.address, icETH.address)
    if (isIcEth) return false
    return queryIsMinting
  }, [queryIsMinting, indexToken])

  const { data: balances } = useMultiChainBalances(props.products)

  const inputTokens = useMemo(() => {
    const isIcEth = isAddressEqual(indexToken.address, icETH.address)
    if (isMinting && !isIcEth) return getCurrencyTokens(chainId, isIcEth)
    return indexTokens
  }, [chainId, indexTokens, indexToken, isMinting])

  const outputTokens = useMemo(() => {
    const isIcEth = isAddressEqual(indexToken.address, icETH.address)
    if (!isMinting || isIcEth) return getCurrencyTokens(chainId, isIcEth)
    return indexTokens
  }, [chainId, indexTokens, indexToken, isMinting])

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
    slippage,
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
      const isIcEth = icETH.symbol === tokenSymbol
      if (icETH) {
        const inputToken = getYieldTokens().find(
          (token) => token.symbol === icETH.symbol && token.chainId === chainId,
        )
        const outputTokens = getCurrencyTokens(1, isIcEth)
        updateQueryParams({
          isMinting,
          inputToken,
          outputToken: outputTokens[0],
          network: chainId,
        })
        return
      }

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
      const isIcEth = icETH.symbol === tokenSymbol
      if (isMinting && !isIcEth) {
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
        products: props.products,
        inputTokens,
        outputTokens,
        isFetchingQuote,
        quoteResult,
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
