import {
  type LeverageToken,
  getTokenByChainAndAddress,
} from '@indexcoop/tokenlists'

import { getLeverageType } from '@/app/leverage/utils/get-leverage-type'
import { formatPrice } from '@/app/products/utils/formatters'
import type { TokenBalance } from '@/lib/hooks/use-balance'
import { formatWei } from '@/lib/utils'
import { fetchTokenMetrics } from '@/lib/utils/api/index-data-provider'

import { leverageTokens } from '../constants'
import type { EnrichedToken } from '../types'

export async function fetchLeverageTokenPrices(
  balances: TokenBalance[],
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
        leverageType: getLeverageType(token as LeverageToken),
        image: token.logoURI,
        balance: current.value,
      },
    ]
  }, [] as EnrichedToken[])

  // Avoid showing a faulty/missing position if the balance call fails
  if (tokenBalances.some((token) => token.balance === null)) return

  try {
    console.log('leverage')
    const navResponses = await Promise.all(
      tokenBalances.map((token) =>
        fetchTokenMetrics({
          chainId,
          tokenAddress: token.address ?? '',
          metrics: ['nav'],
        }),
      ),
    )
    const tokenPrices = navResponses.map(
      (response) => response?.NetAssetValue ?? 0,
    )

    // Avoid showing a $0 position if nav call fails
    if (tokenPrices.some((tokenPrice) => tokenPrice === 0)) return

    const enrichedTokens = tokenBalances.map((token, idx) => {
      const usd =
        Number.parseFloat(formatWei(token.balance, token.decimals)) *
        tokenPrices[idx]
      return {
        ...token,
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

    return enrichedTokens
  } catch (e) {
    console.error('Caught error in fetchTokenPrices', e)
  }
}
