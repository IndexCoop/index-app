'use client'

import { Token } from '@indexcoop/flash-mint-sdk'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import { getCurrencyTokens, getLeverageTokens } from '@/app/leverage/constants'
import { LeverageToken, LeverageType } from '@/app/leverage/types'
import { chains } from '@/lib/utils/wagmi'

type DefaultParams = {
  isMinting: boolean
  leverageType: LeverageType
  network: number
  inputToken: Token
  outputToken: Token
}

type ReturnType<T extends Partial<DefaultParams>> = {
  [K in keyof DefaultParams as `query${Capitalize<string & K>}`]: K extends keyof T
    ? T[K]
    : DefaultParams[K] | undefined
}

export const useQueryParams = <T extends Partial<DefaultParams>>(
  defaultParams: T = {} as T,
): ReturnType<T> => {
  const searchParams = useSearchParams()

  return useMemo(() => {
    const network = parseInt(searchParams.get('network') || '0')
    const buy = searchParams.get('buy') || ''
    const sell = searchParams.get('sell') || ''

    const queryNetwork =
      chains.find((chain) => chain.id === network)?.id ?? defaultParams.network

    const tokens = getCurrencyTokens(queryNetwork ?? 0).concat(
      getLeverageTokens(network),
    )

    const queryOutputToken =
      tokens.find(
        (token) => token.symbol.toLowerCase() === buy.toLowerCase(),
      ) ?? defaultParams.outputToken
    const queryInputToken =
      tokens.find(
        (token) => token.symbol.toLowerCase() === sell.toLowerCase(),
      ) ?? defaultParams.inputToken

    const queryIsMinting = queryOutputToken
      ? 'leverageType' in queryOutputToken
      : defaultParams.isMinting

    const queryLeverageType =
      (queryIsMinting
        ? (queryOutputToken as LeverageToken)?.leverageType
        : (queryInputToken as LeverageToken)?.leverageType) ??
      defaultParams.leverageType

    return {
      queryIsMinting,
      queryLeverageType,
      queryNetwork,
      queryInputToken,
      queryOutputToken,
    } as ReturnType<T>
    // NOTE: defaultQueryPararms should only be read initially.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])
}
