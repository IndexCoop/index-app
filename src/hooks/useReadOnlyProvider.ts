import { useMemo } from 'react'

import { Chain, useNetwork } from 'wagmi'

import { JsonRpcProvider } from '@ethersproject/providers'

import { OPTIMISM, POLYGON } from 'constants/chains'

export const useReadOnlyProvider = (propChainId?: number) => {
  const { chain, chains } = useNetwork()
  const chainId = propChainId ? propChainId : chain?.id ?? 1

  return useMemo(
    () => new JsonRpcProvider(getJsonRpcUrl(chainId, chains)),
    [chainId]
  )
}

export const useAllReadOnlyProviders = () => {
  const mainnetReadOnlyProvider = useReadOnlyProvider()
  const polygonReadOnlyProvider = useReadOnlyProvider(POLYGON.chainId)
  const optimismReadOnlyProvider = useReadOnlyProvider(OPTIMISM.chainId)
  return {
    mainnetReadOnlyProvider,
    polygonReadOnlyProvider,
    optimismReadOnlyProvider,
  }
}

const getJsonRpcUrl = (chainId: number, chains: Chain[]) => {
  const defaultUrl = process.env.REACT_APP_MAINNET_ALCHEMY_API || ''
  return (
    chains.find((chain) => chain.id === chainId)?.rpcUrls.default ?? defaultUrl
  )
}
