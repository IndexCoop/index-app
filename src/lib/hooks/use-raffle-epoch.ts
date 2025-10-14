import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'

import { raffleEpochAtom } from '@/app/store/raffle-epoch.atom'
import { getApiV2RaffleEpochs } from '@/gen'

export const useRaffleEpoch = () => {
  const [, setRaffleEpoch] = useAtom(raffleEpochAtom)

  const { data, isLoading, error } = useQuery({
    queryKey: ['raffle-epoch', 'active'],
    queryFn: async () => {
      const response = await getApiV2RaffleEpochs({ active: true })
      const epoch = response.data[0]
      return epoch
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes to detect silent/active changes
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    staleTime: 4 * 60 * 1000, // Consider data stale after 4 minutes
  })

  if (data) {
    setRaffleEpoch(data)
  }

  return { data, isLoading, error }
}
