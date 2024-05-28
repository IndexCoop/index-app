import { BigNumber } from 'ethers'
import { Dispatch, SetStateAction } from 'react'

import { formatPrice } from '@/app/products/utils/formatters'
import { ARBITRUM } from '@/constants/chains'
import { TokenBalance } from '@/lib/hooks/use-balance'
import { displayFromWei } from '@/lib/utils'
import { NavProvider } from '@/lib/utils/api/nav'

import { leverageTokens } from '../constants'
import { EnrichedToken } from '../types'

import { getLeverageType } from './get-leverage-type'

export async function fetchPositionPrices(
  balances: TokenBalance[],
  setTokens: Dispatch<SetStateAction<EnrichedToken[]>>,
) {
  const tokenBalances = balances.reduce((acc, current) => {
    const token = leverageTokens.find(
      (leverageToken) => current.token === leverageToken.arbitrumAddress,
    )
    return token
      ? [
          ...acc,
          {
            ...token,
            balance: displayFromWei(
              BigNumber.from(current.value.toString()),
              3,
              token.decimals,
            ),
          },
        ]
      : acc
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
