'use client'

import { getCurrencyTokens, getLeverageTokens } from '@/app/leverage/constants'
import { LeverageToken, LeverageType } from '@/app/leverage/types'
import { chains } from '@/lib/utils/wagmi'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

/**
 * Returns possible leverage query params, with handling of default values included
 * @returns
 */
export const useQueryParams = () => {
  const searchParams = useSearchParams()

  return useMemo(() => {
    const network = parseInt(searchParams.get('network') || '0')
    const buy = searchParams.get('buy') || ''
    const sell = searchParams.get('sell') || ''

    const queryNetwork = chains.find((chain) => chain.id === network)?.id

    if (queryNetwork) {
      const tokens = getCurrencyTokens(queryNetwork ?? 0).concat(
        getLeverageTokens(network),
      ) as LeverageToken[]

      const queryOutputToken = tokens.find(
        (token) => token.symbol.toLowerCase() === buy.toLowerCase(),
      )
      const queryInputToken = tokens.find(
        (token) => token.symbol.toLowerCase() === sell.toLowerCase(),
      )

      const queryIsMinting = queryOutputToken
        ? 'leverageType' in queryOutputToken
        : true

      const queryLeverageType =
        (queryIsMinting
          ? queryOutputToken?.leverageType
          : queryInputToken?.leverageType) ?? LeverageType.Long2x

      return {
        queryIsMinting,
        queryLeverageType,
        queryNetwork,
        queryInputToken,
        queryOutputToken,
      }
    }

    return {
      queryIsMinting: true,
      queryLeverageType: LeverageType.Long2x,
      queryNetwork: undefined,
      queryInputToken: undefined,
      queryOutputToken: undefined,
    }
  }, [searchParams])
}
