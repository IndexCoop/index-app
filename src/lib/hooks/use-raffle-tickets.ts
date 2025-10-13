import { useQuery } from '@tanstack/react-query'

import { getApiV2RaffleTickets } from '@/gen'

const initialData = {
  status: 200,
  statusText: 'OK',
  data: {
    epochId: 0,
    epochNumber: 0,
    tickets: 0,
    maturingTickets: 0,
    startDate: '',
    endDate: '',
  },
}

export const useRaffleTickets = (userAddress?: string) => {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['raffle-tickets', userAddress],
    queryFn: () => getApiV2RaffleTickets({ userAddress: userAddress! }),
    enabled: !!userAddress,
    refetchInterval: 30_000,
    staleTime: 10_000,
    placeholderData: initialData,
    select: ({ data }) => data,
  })

  return {
    data,
    isLoading: isLoading || (isFetching && data?.tickets === 0), // Show loading on first fetch or when refetching with 0
    error,
  }
}
