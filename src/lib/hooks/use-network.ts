import { arbitrum, base, mainnet } from 'viem/chains'
import { useAccount } from 'wagmi'

import { networks } from '@/lib/utils/wagmi'

export function useArbitrumOnly() {
  return useSupportedNetworks([arbitrum.id])
}

export function useMainnetOnly() {
  return useSupportedNetworks([mainnet.id])
}

export const useNetwork = () => {
  const { chain } = useAccount()
  const chainId = chain?.id
  const isMainnet = chainId === 1
  const isSupportedNetwork =
    chainId === undefined
      ? true
      : networks.some((chain) => chain.chainId === chainId)
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
