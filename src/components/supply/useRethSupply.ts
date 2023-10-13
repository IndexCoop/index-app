import { useCallback, useEffect, useState } from 'react'
import { IndexREthProvider } from '@indexcoop/analytics-sdk'

import { IcRethUnits } from '@/constants/icreth'
import { useWallet } from '@/lib/hooks/useWallet'
import { SupplyCapState } from './'

interface RethSupplyCapData {
  available: number
  formatted: {
    available: string
  }
  state: SupplyCapState
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
      const availabeOnAave = availableSupply / IcRethUnits
      const availableOnIndex = data.icreth.availableSupply
      const available = Math.min(availabeOnAave, availableOnIndex)
      const totalSupplyPercent = (totalSupply / cap) * 100
      const state = getSupplyCapState(cap, totalSupply)
      console.log(available, availabeOnAave, availableOnIndex)
      setData({
        available,
        formatted: {
          available: available.toString(),
        },
        state,
        totalSupplyPercent,
      })
    } catch (err) {
      console.log('Error fetching RETH supply data', err)
    }
  }, [provider, shouldFetch])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data }
}
