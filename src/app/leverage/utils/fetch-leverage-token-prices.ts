import { getTokenByChainAndAddress } from '@indexcoop/tokenlists'
import { Dispatch, SetStateAction } from 'react'

import { formatPrice } from '@/app/products/utils/formatters'
import { TokenBalance } from '@/lib/hooks/use-balance'
import { formatWei } from '@/lib/utils'
import { NavProvider } from '@/lib/utils/api/nav'

import { leverageTokens } from '../constants'
import { EnrichedToken } from '../types'

export async function fetchLeverageTokenPrices(
  balances: TokenBalance[],
  setTokens: Dispatch<SetStateAction<EnrichedToken[]>>,
  chainId: number,
) {
  const tokenBalances = balances.reduce((acc, current) => {
    const token = getTokenByChainAndAddress(chainId, current.token)

    if (!token) return acc

    const isLeverageToken = leverageTokens.some(
      (leverageTokenSymbol) => leverageTokenSymbol === token.symbol,
    )

    if (!isLeverageToken) return acc

    const tokenIdx = acc.findIndex(
      (accToken) => accToken.symbol === token.symbol,
    )
    if (tokenIdx !== -1) {
      acc[tokenIdx].balance! += current.value
      return acc
    }

    return [
      ...acc,
      {
        ...token,
        image: token.logoURI,
        balance: current.value,
      },
    ]
  }, [] as EnrichedToken[])

  // Avoid showing a faulty/missing position if the balance call fails
  if (tokenBalances.some((token) => token.balance === null)) return

  try {
    const navProvider = new NavProvider()
    const tokenPrices = await Promise.all(
      tokenBalances.map((token) =>
        navProvider.getNavPrice(token.symbol, chainId),
      ),
    )

    // Avoid showing a $0 position if nav call fails
    if (tokenPrices.some((tokenPrice) => tokenPrice === 0)) return

    const enrichedTokens = tokenBalances.map((token, idx) => {
      const usd =
        parseFloat(formatWei(token.balance, token.decimals)) * tokenPrices[idx]
      return {
        ...token,
        leverageType: token.leverageType,
        size: formatPrice(usd),
        usd,
        unitPriceUsd: tokenPrices[idx],
      }
    })
    enrichedTokens.sort((token1, token2) => {
      if (token1.usd > token2.usd) return -1
      if (token2.usd > token1.usd) return 1
      return 0
    })

    setTokens(enrichedTokens)
  } catch (e) {
    console.error('Caught error in fetchTokenPrices', e)
  }
}
