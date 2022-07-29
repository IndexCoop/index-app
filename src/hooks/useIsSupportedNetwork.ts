import { useNetwork } from 'wagmi'

export const useIsSupportedNetwork = (chainId: number = 1): boolean => {
  const { chains } = useNetwork()
  return chains.some((chain) => chain.id === chainId)
}
