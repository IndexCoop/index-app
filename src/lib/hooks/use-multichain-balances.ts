// Add to src/lib/hooks/use-multi-chain-balances.ts
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { createPublicClient, erc20Abi, http } from 'viem'
import { useAccount } from 'wagmi'

import { GetApiV2ProductsEarn200 } from '@/gen'
import { SupportedNetwork, supportedNetworks } from '@/lib/utils/wagmi'

export function useMultiChainBalances(products: GetApiV2ProductsEarn200) {
  const { address } = useAccount()

  const publicClients = useMemo(
    () =>
      Object.fromEntries(
        products.map((product) => {
          const chain = supportedNetworks[product.chainId as SupportedNetwork]
          return [
            product.chainId,
            createPublicClient({
              chain,
              transport: http(),
            }),
          ]
        }),
      ),
    [products],
  )

  return useQuery({
    initialData: [],
    queryKey: ['multichain-balances', address, products],
    enabled: !!address && products?.length > 0,
    queryFn: async () => {
      if (!address || !products?.length) return []

      const results = await Promise.all(
        products.map(async (product) => {
          const { tokenAddress, chainId } = product
          const client = publicClients[chainId]

          const value = await client.readContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [address],
          })

          return {
            token: tokenAddress,
            value,
          }
        }),
      )

      return results
    },
    select: (data) => data.filter((item) => item.value > BigInt(0)),
  })
}
