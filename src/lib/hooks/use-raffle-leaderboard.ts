import { useQuery } from '@tanstack/react-query'

import { getApiV2RaffleLeaderboardEpochid } from '@/gen'

export const useRaffleLeaderboard = (epochId: number, limit = 50) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['raffle-leaderboard', epochId, limit],
    queryFn: () => getApiV2RaffleLeaderboardEpochid({ epochId }, { limit }),
    enabled: !!epochId,
    staleTime: 30_000, // Consider data stale after 30 seconds
    refetchInterval: 60_000, // Refetch every minute
  })

  return {
    data: data?.data,
    isLoading,
    error,
  }
}
