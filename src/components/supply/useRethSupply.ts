import { useCallback, useEffect, useState } from 'react'
import { IndexREthProvider } from '@indexcoop/analytics-sdk'

import { IcRethUnits } from '@/constants/icreth'
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
      const { availableSupply, cap, totalSupply } = data.reth
      const totalSupplyPercent = (totalSupply / cap) * 100
      const state = getSupplyCapState(cap, totalSupply)
      setData({
        cap,
        formatted: {
          available: (availableSupply / IcRethUnits).toString(),
          cap: (cap / IcRethUnits).toFixed(2),
          totalSupply: (totalSupply / IcRethUnits).toFixed(2),
        },
        state,
        totalSupply,
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
