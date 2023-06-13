import { useMemo } from 'react'

import { Chain, useNetwork } from 'wagmi'

import { JsonRpcProvider } from '@ethersproject/providers'

import { MAINNET, OPTIMISM, POLYGON } from '../../constants/chains'
import { AlchemyMainnetUrl } from '../../constants/server'

export const useReadOnlyProvider = (propChainId?: number) => {
  const { chain, chains } = useNetwork()
  const chainId = propChainId ? propChainId : chain?.id ?? 1

  return useMemo(
    () => new JsonRpcProvider(getJsonRpcUrl(chainId, chains)),
    [chainId, chains]
  )
}

export const useAllReadOnlyProviders = () => {
  const mainnetReadOnlyProvider = useReadOnlyProvider(MAINNET.chainId)
  const polygonReadOnlyProvider = useReadOnlyProvider(POLYGON.chainId)
  const optimismReadOnlyProvider = useReadOnlyProvider(OPTIMISM.chainId)
  return {
    mainnetReadOnlyProvider,
    polygonReadOnlyProvider,
    optimismReadOnlyProvider,
  }
}

const getJsonRpcUrl = (chainId: number, chains: Chain[]) => {
  const defaultUrl = AlchemyMainnetUrl
  return (
    chains.find((chain) => chain.id === chainId)?.rpcUrls.default.http[0] ??
    defaultUrl
  )
}
