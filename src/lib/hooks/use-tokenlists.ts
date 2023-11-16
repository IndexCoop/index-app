import { useMemo } from 'react'

import indicesTokenList from '@/constants/tokenlists'
import { Token } from '@/constants/tokens'
import { fetchCoingeckoTokenPrice } from '@/lib/utils/api/coingecko'
import {
  getAddressForToken,
  getCurrencyTokensForIndex,
} from '@/lib/utils/tokens'

export function useTokenlists(
  inputToken: Token,
  outputToken: Token,
  isMinting: boolean
) {
  const indexToken = useMemo(
    () => (isMinting ? outputToken : inputToken),
    [isMinting, inputToken, outputToken]
  )
  const currenciesList = getCurrencyTokensForIndex(indexToken, 1, isMinting)
  const tokenList = indicesTokenList

  const inputTokensList = useMemo(
    () => (isMinting ? currenciesList : tokenList),
    [isMinting, currenciesList, tokenList]
  )

  const outputTokensList = useMemo(
    () => (isMinting ? tokenList : currenciesList),
    [isMinting, currenciesList, tokenList]
  )

  // TODO:
  // const toggleIsMinting = () => {
  //   // TODO: test
  //   setIsBuying(!isBuying)
  //   routeSwap(outputToken.symbol, inputToken.symbol)
  // }

  return {
    inputTokensList,
    outputTokensList,
    // toggleIsMinting,
  }
}
