import { useNetwork as useNetworkWagmi } from 'wagmi'

export const useNetwork = () => {
  const { chain, chains } = useNetworkWagmi()
  const chainId = chain?.id
  const isMainnet = chainId === 1
  const isSupportedNetwork =
    chainId === undefined ? true : chains.some((chain) => chain.id === chainId)
  return { chainId, isMainnet, isSupportedNetwork }
}
