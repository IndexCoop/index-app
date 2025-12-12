import { arbitrum, base, mainnet } from 'viem/chains'
import { useAccount, useSwitchChain } from 'wagmi'

import { useQueryParams } from '@/lib/hooks/use-query-params'
import { chains } from '@/lib/utils/wagmi'

export const useNetwork = () => {
  const { chain } = useAccount()
  const { queryParams } = useQueryParams()
  const { switchChain } = useSwitchChain()
  const chainId = queryParams.queryNetwork ?? chain?.id
  const isMainnet = chainId === 1
  const isSupportedNetwork =
    chainId === undefined ? true : chains.some((chain) => chain.id === chainId)
  const name = getNetworkName(chainId)
  return { chainId, isMainnet, isSupportedNetwork, name, switchChain }
}

export function useSupportedNetworks(chainIds: number[]) {
  const { chain } = useAccount()
  if (!chain) return false
  return chainIds.some((chainId) => chain.id === chainId)
}

export function getNetworkName(chainId: number | undefined): string | null {
  switch (chainId) {
    case arbitrum.id:
      return 'Arbitrum'
    case base.id:
      return 'Base'
    case mainnet.id:
      return 'Ethereum'
    default:
      return null
  }
}
