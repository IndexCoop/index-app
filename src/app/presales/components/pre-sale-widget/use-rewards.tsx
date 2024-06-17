import { useCallback, useEffect, useState } from 'react'

import { IndexApi } from '@/lib/utils/api/index-api'

const earnedRewardsDefault = '0'

export function usePrtRewards(
  address: string | undefined,
  tokenAddress: string | undefined,
) {
  const [earnedRewards, setEarnedRewards] = useState(earnedRewardsDefault)

  const fetchRewards = useCallback(async () => {
    if (!address || !tokenAddress) {
      setEarnedRewards(earnedRewardsDefault)
      return
    }
    try {
      const indexApi = new IndexApi()
      const res = await indexApi.get(
        `/prts/${address}?tokenAddress=${tokenAddress}`,
      )
      setEarnedRewards(res.cumulative_rewards)
    } catch (err) {
      console.log('Error fetching prt rewards', err)
    }
  }, [address, tokenAddress])

  useEffect(() => {
    fetchRewards()
  }, [fetchRewards])

  const refetch = () => {
    fetchRewards()
  }

  return {
    earnedRewards,
    refetch,
  }
}
