import { useCallback, useEffect, useState } from 'react'
import { IndexREthProvider } from '@indexcoop/analytics-sdk'

import { useWallet } from '@/lib/hooks/useWallet'
import { SupplyCapState } from './'

interface RethSupplyCapData {
  cap: number
  formatted: {
    // note that this is available icRETH
    available: string
    // these are cap and total supply of rETH on aave
    cap: string
    totalSupply: string
  }
  state: SupplyCapState
  totalSupply: number
  totalSupplyPercent: number
}

function getSupplyCapState(cap: number, totalSupply: number): SupplyCapState {
  if (totalSupply >= cap) return SupplyCapState.capReached
  return SupplyCapState.available
}

export const useRethSupply = (
  shouldFetch: boolean
): { data: RethSupplyCapData | null } => {
  const { provider } = useWallet()
  const [data, setData] = useState<RethSupplyCapData | null>(null)

  const fetchData = useCallback(async () => {
    if (!shouldFetch) return
    try {
      const rethProvider = new IndexREthProvider(provider)
      const data = await rethProvider.getSupplyData()
      const { cap, totalSupply } = data.reth
      const totalSupplyPercent = (totalSupply / cap) * 100
      const state = getSupplyCapState(cap, totalSupply)
      // FIXME: addd icRETH data
      setData({
        cap: data.reth.cap,
        formatted: {
          // FIXME: adjust units before launch
          available: (data.reth.availableSupply / 8).toString(),
          cap: cap.toFixed(2),
          totalSupply: totalSupply.toFixed(2),
        },
        state,
        totalSupply: data.reth.totalSupply,
        totalSupplyPercent,
      })
    } catch (err) {
      console.log('Error fetching RETH supply data', err)
    }
  }, [shouldFetch])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data }
}
