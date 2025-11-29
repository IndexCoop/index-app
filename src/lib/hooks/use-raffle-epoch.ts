import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

import { raffleEpochAtom } from '@/app/store/raffle-epoch.atom'
import { getApiV2RaffleEpochs } from '@/gen'

export const useRaffleEpoch = () => {
  const [, setRaffleEpoch] = useAtom(raffleEpochAtom)

  const { data, isLoading, error } = useQuery({
    queryKey: ['raffle-epoch', 'active'],
    queryFn: async () => {
      const response = await getApiV2RaffleEpochs({ active: true })
      // Filter out silent epochs and take the first (latest) non-silent active epoch
      const epochs = response.data?.filter((e) => !e.silent) ?? []
      return epochs[0] ?? null
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes to detect silent/active changes
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    staleTime: 4 * 60 * 1000, // Consider data stale after 4 minutes
  })

  useEffect(() => {
    if (data) {
      setRaffleEpoch(data)
    }
  }, [data, setRaffleEpoch])

  return { data, isLoading, error }
}
