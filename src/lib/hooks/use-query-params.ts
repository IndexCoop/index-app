'use client'

import { Token } from '@indexcoop/flash-mint-sdk'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import { getCurrencyTokens, getLeverageTokens } from '@/app/leverage/constants'
import { LeverageToken, LeverageType } from '@/app/leverage/types'
import { chains } from '@/lib/utils/wagmi'

type DefaultParams = Partial<{
  isMinting: boolean
  leverageType: LeverageType
  network: number
  inputToken: Token
  outputToken: Token
}>

type AdjustedReturnType<T extends DefaultParams> = {
  [K in keyof T as `query${Capitalize<string & K>}`]: T[K] extends undefined
    ? T[K] | undefined
    : T[K]
}

export const useQueryParams = <T extends DefaultParams>(
  defaultParams: T = {} as T,
): AdjustedReturnType<T> => {
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
    } as AdjustedReturnType<T>
    // NOTE: defaultQueryPararms should only be read initially.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])
}
