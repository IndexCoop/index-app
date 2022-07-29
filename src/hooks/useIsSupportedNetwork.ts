import { useNetwork } from 'wagmi'

export const useIsSupportedNetwork = (chainId: number | undefined): boolean => {
  const { chains } = useNetwork()
  if (chainId === undefined) return true
  return chains.some((chain) => chain.id === chainId)
}
