'use client'

import { Token } from '@indexcoop/flash-mint-sdk'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import { getCurrencyTokens, getLeverageTokens } from '@/app/leverage/constants'
import { LeverageToken, LeverageType } from '@/app/leverage/types'
import { chains } from '@/lib/utils/wagmi'

type DefaultQueryParams = Partial<{
  queryIsMinting: boolean
  queryLeverageType: LeverageType
  queryNetwork: number
  queryInputToken: Token
  queryOutputToken: Token
}>

type AdjustedReturnType<T extends DefaultQueryParams> = {
  queryIsMinting: T['queryIsMinting'] extends undefined
    ? boolean | undefined
    : T['queryIsMinting']
  queryLeverageType: T['queryLeverageType'] extends undefined
    ? LeverageType | undefined
    : T['queryLeverageType']
  queryNetwork: T['queryNetwork'] extends undefined
    ? number | undefined
    : T['queryNetwork']
  queryInputToken: T['queryInputToken'] extends undefined
    ? Token | undefined
    : T['queryInputToken']
  queryOutputToken: T['queryOutputToken'] extends undefined
    ? Token | undefined
    : T['queryOutputToken']
}

export const useQueryParams = <T extends DefaultQueryParams>(
  defaultQueryPararms: T = {} as T,
): AdjustedReturnType<T> => {
  const searchParams = useSearchParams()

  return useMemo(() => {
    const network = parseInt(searchParams.get('network') || '0')
    const buy = searchParams.get('buy') || ''
    const sell = searchParams.get('sell') || ''

    const queryNetwork =
      chains.find((chain) => chain.id === network)?.id ??
      defaultQueryPararms.queryNetwork

    const tokens = getCurrencyTokens(queryNetwork ?? 0).concat(
      getLeverageTokens(network),
    )

    const queryOutputToken =
      tokens.find(
        (token) => token.symbol.toLowerCase() === buy.toLowerCase(),
      ) ?? defaultQueryPararms.queryOutputToken
    const queryInputToken =
      tokens.find(
        (token) => token.symbol.toLowerCase() === sell.toLowerCase(),
      ) ?? defaultQueryPararms.queryInputToken

    const queryIsMinting = queryOutputToken
      ? 'leverageType' in queryOutputToken
      : defaultQueryPararms.queryIsMinting

    const queryLeverageType =
      (queryIsMinting
        ? (queryOutputToken as LeverageToken)?.leverageType
        : (queryInputToken as LeverageToken)?.leverageType) ??
      defaultQueryPararms.queryLeverageType

    return {
      queryIsMinting,
      queryLeverageType,
      queryNetwork,
      queryInputToken,
      queryOutputToken,
    }
    // NOTE: defaultQueryPararms should only be read initially.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])
}
