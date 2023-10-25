import { useCallback, useEffect, useMemo, useState } from 'react'

import { MAINNET } from '@/constants/chains'
import { IndexToken, MoneyMarketIndex, Token } from '@/constants/tokens'
import { IndexApi } from '@/lib/utils/api/index-api'
import { getAddressForToken } from '@/lib/utils/tokens'

export interface SetComponent {
  /**
   * Token address
   * @example "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
   */
  address: string

  /**
   * Token id
   * @example "uniswap"
   */
  id: string

  /**
   * Token image URL
   * @example "https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png"
   */
  image: string

  /**
   * Token name
   * @example "Uniswap"
   */
  name: string

  /**
   * The percent of USD this component makes up in the Set.
   * Equivalant to totalPriceUsd / total price of set in USD
   */
  percentOfSet: string

  /**
   * The percent of USD this component makes up in the Set.
   * Equivalant to totalPriceUsd / total price of set in USD
   */
  percentOfSetNumber: number

  /**
   * Quantity of component in the Set
   */
  quantity: string

  /**
   * Token symbol
   * @example "UNI"
   */
  symbol: string

  /**
   * Total price of this component. This is equivalant to quantity of
   * component * price of component.
   */
  totalPriceUsd: string

  /**
   * Daily percent price change of this component
   */
  dailyPercentChange: string
}

export const useTokenComponents = (token: Token, isPerpToken = false) => {
  const [components, setComponents] = useState<SetComponent[]>([])
  const [nav, setNav] = useState<number>(0)
  const [vAssets, setVAssets] = useState<SetComponent[]>([])

  const fetchComponents = useCallback(async () => {
    const chainId = token.defaultChain || MAINNET.chainId
    const address = getAddressForToken(token, chainId)
    if (!address || token.symbol === IndexToken.symbol) return
    try {
      const indexApi = new IndexApi()
      const path = `/components?chainId=${chainId}&isPerpToken=${isPerpToken}&address=${address}`
      const { components, vAssets } = await indexApi.get(path)
      setComponents(components)
      setVAssets(vAssets)
    } catch (err) {
      console.log('Error fetching components:', err)
    }
  }, [token, isPerpToken])

  useEffect(() => {
    fetchComponents()
  }, [fetchComponents])

  useMemo(async () => {
    if (components.length === 0 && vAssets.length === 0) return
    if (token.symbol === MoneyMarketIndex.symbol) {
      const nav = await fetchIcSmmtNav()
      setNav(nav)
      return
    }
    setNav(getNetAssetValue(components.concat(vAssets)))
  }, [components, token.symbol, vAssets])

  return { components, vAssets, nav }
}

async function fetchIcSmmtNav(): Promise<number> {
  try {
    const indexApi = new IndexApi()
    const path = '/icsmmt/nav'
    const { nav } = await indexApi.get(path)
    return nav
  } catch (err) {
    console.log('Error fetching NAV for icSMMT:', err)
    return 0
  }
}

function getNetAssetValue(components: SetComponent[]): number {
  let totalValue: number = 0
  if (components.length > 0)
    components.forEach((c) => {
      totalValue += parseFloat(c.totalPriceUsd)
    })
  return totalValue
}
