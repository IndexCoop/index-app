import { useQuery } from '@tanstack/react-query'

import { getApiV2RaffleUserAddressStatus } from '@/gen'

const initialData = {
  status: 200,
  statusText: 'OK',
  data: {
    hasUnclaimedRewards: false,
    tokens: [],
  },
}

export const useUserRaffleStatus = (address?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-raffle-status', address],
    queryFn: () => getApiV2RaffleUserAddressStatus({ address: address! }),
    enabled: !!address,
    refetchInterval: 30_000,
    staleTime: 10_000,
    placeholderData: initialData,
    select: ({ data }) => data,
  })

  return {
    data,
    isLoading,
    error,
  }
}
