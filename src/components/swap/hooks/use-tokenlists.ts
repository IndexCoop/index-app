import { useMemo } from 'react'

import { indicesTokenList } from '@/constants/tokenlists'
import { Token } from '@/constants/tokens'
import { getCurrencyTokensForIndex } from '@/lib/utils/tokens'

export function useTokenlists(
  isMinting: boolean,
  inputToken: Token,
  outputToken: Token,
) {
  const indexToken = useMemo(
    () => (isMinting ? outputToken : inputToken),
    [isMinting, inputToken, outputToken],
  )
  const currenciesList = useMemo(
    () => getCurrencyTokensForIndex(indexToken, 1),
    [indexToken],
  )
  const tokenList = indicesTokenList

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
