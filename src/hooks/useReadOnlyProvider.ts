import { useMemo } from 'react'

import { Chain, useNetwork } from 'wagmi'

import { JsonRpcProvider } from '@ethersproject/providers'

export const useReadOnlyProvider = (propChainId?: number) => {
  const { chain, chains } = useNetwork()
  const chainId = propChainId ? propChainId : chain?.id ?? 1

  return useMemo(
    () => new JsonRpcProvider(getJsonRpcUrl(chainId, chains)),
    [chainId]
  )
}

const getJsonRpcUrl = (chainId: number, chains: Chain[]) => {
  const defaultUrl = process.env.REACT_APP_MAINNET_ALCHEMY_API || ''
  return (
    chains.find((chain) => chain.id === chainId)?.rpcUrls.default ?? defaultUrl
  )
}
