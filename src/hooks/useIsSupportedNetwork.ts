import { useNetwork } from 'wagmi'

export const useIsSupportedNetwork = (chainId: number): boolean => {
  const { chains } = useNetwork()
  return chains.some((chain) => chain.id === chainId)
}
