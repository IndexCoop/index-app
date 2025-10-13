import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'

import { raffleEpochAtom } from '@/app/store/raffle-epoch.atom'
import { getApiV2RaffleEpochs } from '@/gen'

export const useRaffleEpoch = () => {
  const [raffleEpoch, setRaffleEpoch] = useAtom(raffleEpochAtom)

  const { data, isLoading, error } = useQuery({
    queryKey: ['raffle-epoch', 'active'],
    queryFn: async () => {
      const response = await getApiV2RaffleEpochs({ active: true })
      const epoch = response.data[0]
      return epoch
    },
    enabled:
      !raffleEpoch || Date.now() > new Date(raffleEpoch.endDate).getTime(),
  })

  if (data) {
    setRaffleEpoch(data)
  }

  return { data, isLoading, error }
}
