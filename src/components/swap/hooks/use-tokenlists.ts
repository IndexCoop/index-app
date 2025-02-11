import { useMemo } from 'react'

import { ARBITRUM, BASE } from '@/constants/chains'
import {
  indicesTokenList,
  indicesTokenListArbitrum,
  indicesTokenListBase,
} from '@/constants/tokenlists'
import { Token } from '@/constants/tokens'
import { getCurrencyTokensForIndex } from '@/lib/utils/tokens'

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
    if (chainId === BASE.chainId) return indicesTokenListBase

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
