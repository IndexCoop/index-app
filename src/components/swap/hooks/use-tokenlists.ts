import { useMemo } from 'react'

import { ARBITRUM } from '@/constants/chains'
import {
  indicesTokenList,
  indicesTokenListArbitrum,
} from '@/constants/tokenlists'
import { getCurrencyTokensForIndex } from '@/lib/utils/tokens'

import type { Token } from '@/constants/tokens'

export function useTokenlists(
  chainId: number,
  isMinting: boolean,
  inputToken: Token,
  outputToken: Token,
) {
  const indexToken = useMemo(
    () => (isMinting ? outputToken : inputToken),
    [isMinting, inputToken, outputToken],
  )
  const currenciesList = useMemo(
    () => getCurrencyTokensForIndex(indexToken, chainId),
    [chainId, indexToken],
  )
  const tokenList = useMemo(() => {
    if (chainId === ARBITRUM.chainId) return indicesTokenListArbitrum
    return indicesTokenList
  }, [chainId])

  const inputTokenslist = useMemo(
    () => (isMinting ? currenciesList : tokenList),
    [isMinting, currenciesList, tokenList],
  )

  const outputTokenslist = useMemo(
    () => (isMinting ? tokenList : currenciesList),
    [isMinting, currenciesList, tokenList],
  )

  return {
    inputTokenslist,
    outputTokenslist,
  }
}
