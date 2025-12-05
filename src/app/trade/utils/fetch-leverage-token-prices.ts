import { getTokenByChainAndAddress } from '@indexcoop/tokenlists'

import { getLeverageType } from '@/app/trade/utils/get-leverage-type'
import { formatWei } from '@/lib/utils'
import { fetchTokenMetrics } from '@/lib/utils/api/index-data-provider'
import { formatPrice } from '@/lib/utils/formatters'

import { leverageTokens } from '../constants'

import type { EnrichedToken } from '@/app/trade/types'
import type { GetApiV2UserAddressPositions200 } from '@/gen'
import type { TokenBalance } from '@/lib/hooks/use-balance'
import type { LeverageToken } from '@indexcoop/tokenlists'

export const calculateAverageEntryPrice = (
  positions: GetApiV2UserAddressPositions200 = [],
) => {
  const grouped = positions.reduce(
    (acc, position) => {
      if (
        position.trade &&
        position.metrics &&
        position.trade.transactionType === 'buy'
      ) {
        const tokenAddress = position.metrics.tokenAddress

        if (!acc[tokenAddress]) {
          acc[tokenAddress] = { sum: 0, count: 0 }
        }

        acc[tokenAddress].sum +=
          (position.trade.underlyingAssetUnitPrice ?? 0) *
          (position.metrics.totalPurchaseSize ?? 0)
        acc[tokenAddress].count += position.metrics.totalPurchaseSize ?? 0
      }
      return acc
    },
    {} as Record<string, { sum: number; count: number }>,
  )

  const averages = Object.keys(grouped).reduce(
    (acc, tokenAddress) => {
      acc[tokenAddress] =
        grouped[tokenAddress].sum / grouped[tokenAddress].count
      return acc
    },
    {} as Record<string, number>,
  )

  return averages
}

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
