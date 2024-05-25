import { Dispatch, SetStateAction } from 'react'
import { parseUnits } from 'viem'

import { formatPrice } from '@/app/products/utils/formatters'
import { ARBITRUM } from '@/constants/chains'
import { TokenBalance } from '@/lib/hooks/use-balance'
import { NavProvider } from '@/lib/utils/api/nav'

import { leverageTokens } from '../constants'
import { EnrichedToken } from '../types'

import { getLeverageType } from './get-leverage-type'

export async function fetchLeverageTokenPrices(
  balances: TokenBalance[],
  setTokens: Dispatch<SetStateAction<EnrichedToken[]>>,
) {
  const tokenBalances = balances.reduce((acc, current) => {
    const token = leverageTokens.find(
      (leverageToken) => current.token === leverageToken.arbitrumAddress,
    )

    if (!token || current.value === BigInt(0)) return acc

    const tokenIdx = acc.findIndex(
      (accToken) => accToken.symbol === token.symbol,
    )
    if (tokenIdx !== -1) {
      acc[tokenIdx].balance! += parseUnits(
        current.value.toString(),
        token.decimals,
      )
      return acc
    }

    return [
      ...acc,
      {
        ...token,
        balance: parseUnits(current.value.toString(), token.decimals),
      },
    ]
  }, [] as EnrichedToken[])

  // Avoid showing a faulty/missing position if the balance call fails
  if (tokenBalances.some((token) => token.balance === null)) return

  try {
    const navProvider = new NavProvider()
    const tokenPrices = await Promise.all(
      tokenBalances.map((token) =>
        navProvider.getNavPrice(token.symbol, ARBITRUM.chainId),
      ),
    )

    // Avoid showing a $0 position if nav call fails
    if (tokenPrices.some((tokenPrice) => tokenPrice === 0)) return

    const enrichedTokens = tokenBalances.map((token, idx) => ({
      ...token,
      leverageType: getLeverageType(token),
      size: formatPrice(Number(token.balance) * tokenPrices[idx]),
    }))

    setTokens(enrichedTokens)
  } catch (e) {
    console.error('Caught error in fetchTokenPrices', e)
  }
}
