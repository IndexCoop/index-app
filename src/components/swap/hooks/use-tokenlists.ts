import { useMemo } from 'react'

import { ARBITRUM } from '@/constants/chains'
import {
  indicesTokenList,
  indicesTokenListArbitrum,
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
  const tokenList = useMemo(
    () =>
      chainId === ARBITRUM.chainId
        ? indicesTokenListArbitrum
        : indicesTokenList,
    [chainId],
  )

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
