import { useCallback, useEffect, useState } from 'react'
import { IndexREthProvider } from '@indexcoop/analytics-sdk'

import { useWallet } from '@/lib/hooks/useWallet'

interface RethSupplyCapData {
  cap: number
  formatted: {
    // note that this is available icRETH
    available: string
    // these are cap and total supply of rETH on aave
    cap: string
    totalSupply: string
  }
  totalSupply: number
  totalSupplyPercent: number
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
      const { cap, totalSupply } = data
      const totalSupplyPercent = (totalSupply / cap) * 100
      setData({
        cap: data.cap,
        formatted: {
          available: (data.availableSupply / 8).toString(),
          cap: cap.toFixed(2),
          totalSupply: totalSupply.toString(),
        },
        totalSupply: data.totalSupply,
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
