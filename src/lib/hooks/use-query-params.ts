'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import { getCurrencyTokens, getLeverageTokens } from '@/app/leverage/constants'
import { LeverageToken, LeverageType } from '@/app/leverage/types'
import { Token } from '@/constants/tokens'
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
}
