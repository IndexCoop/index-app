import { useAccount } from 'wagmi'

import { chains } from '@/lib/utils/wagmi'

export const useNetwork = () => {
  const { chain } = useAccount()
  const chainId = chain?.id
  const isMainnet = chainId === 1
  const isSupportedNetwork =
    chainId === undefined ? true : chains.some((chain) => chain.id === chainId)
  const name = getNetworkName(chainId)
  return { chainId, isMainnet, isSupportedNetwork, name }
}

export function useSupportedNetworks(chainIds: number[]) {
  const { chain } = useAccount()
  if (!chain) return false
  return chainIds.some((chainId) => chain.id === chainId)
}

function getNetworkName(chainId: number | undefined): string | null {
  switch (chainId) {
    case 1:
      return 'Ethereum'
    case 10:
      return 'Optimism'
    case 137:
      return 'Polygon'
    default:
      return null
  }
}
