import { useAccount } from 'wagmi'

import { useNetwork } from '@/lib/hooks/use-network'

export const useIsMismatchingNetwork = () => {
  const { chainId } = useNetwork()
  const { chainId: walletChainId } = useAccount()

  return chainId !== walletChainId
}
