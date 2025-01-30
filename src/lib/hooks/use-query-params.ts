'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useAccount } from 'wagmi'

import { getCurrencyTokens, getLeverageTokens } from '@/app/leverage/constants'
import { LeverageToken, LeverageType } from '@/app/leverage/types'
import { BTC, ETH, Token } from '@/constants/tokens'
import { chains } from '@/lib/utils/wagmi'

type UseQueryParamsArgs = {
  baseToken: Token
  isMinting: boolean
  leverageType: LeverageType
  network: number
  inputToken: Token
  outputToken: Token
}

type ReturnType<T extends Partial<UseQueryParamsArgs>> = {
  [K in keyof UseQueryParamsArgs as `query${Capitalize<string & K>}`]: K extends keyof T
    ? T[K]
    : UseQueryParamsArgs[K] | undefined
}

export const useQueryParams = <T extends Partial<UseQueryParamsArgs>>(
  defaultParams: T = {} as T,
): {
  queryParams: ReturnType<T>
  searchParams: URLSearchParams
  updateQueryParams: (newParams: Partial<UseQueryParamsArgs>) => void
} => {
  const searchParams = useSearchParams()

  const router = useRouter()

  const { chainId } = useAccount()

  const queryParams = useMemo(() => {
    const network = parseInt(searchParams.get('network') ?? '0')
    const buy = searchParams.get('buy') || ''
    const sell = searchParams.get('sell') || ''

    const queryNetwork =
      chains.find((chain) => chain.id === network)?.id ?? chainId

    const currencyTokens = getCurrencyTokens(queryNetwork ?? chainId ?? 1)
    const leverageTokens = getLeverageTokens(queryNetwork ?? chainId ?? 1)

    let queryOutputToken: Token | undefined = currencyTokens.find(
      (token) => token.symbol.toLowerCase() === buy.toLowerCase(),
    )

    let queryInputToken: Token | undefined = leverageTokens.find(
      (token) => token.symbol.toLowerCase() === sell.toLowerCase(),
    )

    if (!queryInputToken || !queryOutputToken) {
      queryOutputToken = leverageTokens.find(
        (token) => token.symbol.toLowerCase() === buy.toLowerCase(),
      )

      queryInputToken = currencyTokens.find(
        (token) => token.symbol.toLowerCase() === sell.toLowerCase(),
      )
    }

    if (!queryInputToken) {
      queryInputToken = defaultParams.inputToken
    }

    if (!queryOutputToken) {
      queryOutputToken = defaultParams.outputToken
    }

    const queryIsMinting =
      queryOutputToken && 'leverageType' in queryOutputToken

    const queryLeverageType = queryIsMinting
      ? (queryOutputToken as LeverageToken)?.leverageType
      : (queryInputToken as LeverageToken)?.leverageType

    const baseTokenSymbol = queryIsMinting
      ? (queryOutputToken as LeverageToken)?.baseToken
      : (queryInputToken as LeverageToken)?.baseToken
    const queryBaseToken = baseTokenSymbol === 'ETH' ? ETH : BTC

    return {
      queryBaseToken: queryBaseToken ?? defaultParams.baseToken,
      queryIsMinting: queryIsMinting ?? defaultParams.isMinting,
      queryLeverageType: queryLeverageType ?? defaultParams.leverageType,
      queryNetwork: queryNetwork ?? defaultParams.network,
      queryInputToken,
      queryOutputToken,
    } as ReturnType<T>
    // NOTE: defaultQueryPararms should only be read initially.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const updateQueryParams = useCallback(
    (newParams: Partial<UseQueryParamsArgs>) => {
      if (typeof window === 'undefined') return

      const queryParams = new URLSearchParams()

      const { network, inputToken, outputToken } = newParams

      if (inputToken) {
        queryParams.set('sell', inputToken.symbol)
      }

      if (outputToken) {
        queryParams.set('buy', outputToken.symbol)
      }

      if (network) {
        queryParams.set('network', network.toString())
      }

      router.replace(`?${queryParams.toString()}`, { scroll: false })
    },
    [router],
  )

  return {
    queryParams,
    searchParams,
    updateQueryParams,
  }
}
