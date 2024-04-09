import { useCallback, useEffect, useState } from 'react'

import { IndexApi } from '@/lib/utils/api/index-api'

export function usePrtRewards(address: string | undefined) {
  const [earnedRewards, setEarnedRewards] = useState('')

  const fetchRewards = useCallback(async () => {
    if (!address) {
      setEarnedRewards('')
      return
    }
    try {
      const indexApi = new IndexApi()
      const res = await indexApi.get(`/prts/${address}`)
      //   const formattedRewards = formatAmount(Number(res.reward_earned))
      setEarnedRewards(res.reward_earned)
    } catch (err) {
      console.log('Error fetching token stats', err)
    }
  }, [address])

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
