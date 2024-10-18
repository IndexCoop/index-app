'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

import { getCurrencyTokens, getLeverageTokens } from '@/app/leverage/constants'
import { LeverageToken, LeverageType } from '@/app/leverage/types'
import { Token } from '@/constants/tokens'
import { chains } from '@/lib/utils/wagmi'

type UseQueryParamsArgs = {
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
  updateQueryParams: (newParams: Partial<UseQueryParamsArgs>) => void
} => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const queryParams = useMemo(() => {
    const network = parseInt(searchParams.get('network') || '0')
    const buy = searchParams.get('buy') || ''
    const sell = searchParams.get('sell') || ''

    const queryNetwork = chains.find((chain) => chain.id === network)?.id

    const currencyTokens = getCurrencyTokens(queryNetwork ?? 0)
    const leverageTokens = getLeverageTokens(queryNetwork ?? 0)

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

    const queryIsMinting =
      queryOutputToken && 'leverageType' in queryOutputToken

    const queryLeverageType = queryIsMinting
      ? (queryOutputToken as LeverageToken)?.leverageType
      : (queryInputToken as LeverageToken)?.leverageType

    return {
      queryIsMinting: queryIsMinting ?? defaultParams.isMinting,
      queryLeverageType: queryLeverageType ?? defaultParams.leverageType,
      queryNetwork: queryNetwork ?? defaultParams.network,
      queryInputToken: queryInputToken ?? defaultParams.inputToken,
      queryOutputToken: queryOutputToken ?? defaultParams.outputToken,
    } as ReturnType<T>
    // NOTE: defaultQueryPararms should only be read initially.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateQueryParams = useCallback(
    (newParams: Partial<UseQueryParamsArgs>) => {
      const defaultQueryString = `?buy=ETH2X&sell=ETH&network=1`
      if(typeof window === 'undefined')  return defaultQueryString
      const queryParams = new URLSearchParams(window.location.search)

      const { network, inputToken, outputToken } = newParams

      queryParams.set(
        'buy',
        outputToken?.symbol ?? queryParams.get('buy') ?? '',
      )
      queryParams.set(
        'sell',
        inputToken?.symbol ?? queryParams.get('sell') ?? '',
      )

      queryParams.set(
        'network',
        network?.toString() ?? queryParams.get('network') ?? '',
      )

      router.replace(`?${queryParams.toString()}`)
    },
    [router],
  )

  return {
    queryParams,
    updateQueryParams,
  }
}
