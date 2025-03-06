import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'

import { useNetwork } from '@/lib/hooks/use-network'

// Base fee: 15 GWei (fallback)
let baseFeePerGasFallback = BigInt(15e9)
// Max Priority Fee (tip): 2 GWei (fallback)
let maxPriorityFeePerGasFallback = BigInt(2e9)

const fallbackData = {
  baseFeePerGas: baseFeePerGasFallback,
  maxFeePerGas: baseFeePerGasFallback + maxPriorityFeePerGasFallback,
  maxPriorityFeePerGas: maxPriorityFeePerGasFallback,
}

export function useGasData() {
  const { chainId } = useNetwork()
  const publicClient = usePublicClient()

  const { data } = useQuery({
    enabled: Boolean(chainId),
    initialData: fallbackData,
    queryKey: [
      'use-gas-data',
      {
        chainId,
        publicClient,
      },
    ],
    queryFn: async () => {
      if (!chainId) return fallbackData
      if (!publicClient) return null

      const feeHistory = await publicClient.getFeeHistory({
        blockCount: 10,
        rewardPercentiles: [50],
      })

      console.log(feeHistory)

      let baseFeePerGas = baseFeePerGasFallback
      let maxPriorityFeePerGas = maxPriorityFeePerGasFallback

      if (feeHistory && feeHistory.reward) {
        baseFeePerGas =
          feeHistory.baseFeePerGas.sort()[
            Math.floor(feeHistory.baseFeePerGas.length / 2)
          ]
        // Get median of maxPriorityFeePerGas
        const priorityFees = feeHistory.reward.map((reward) => reward[0])
        maxPriorityFeePerGas =
          priorityFees.sort()[Math.floor(priorityFees.length / 2)]
      }

      const maxFeePerGas = baseFeePerGas + maxPriorityFeePerGas

      return {
        baseFeePerGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
      }
    },
  })

  return data
}
