import { useMemo } from 'react'

import { useNetwork } from 'wagmi'

import { JsonRpcProvider } from '@ethersproject/providers'

export const useReadOnlyProvider = () => {
  const { chain } = useNetwork()
  const chainId = chain?.id ?? 1
  // tODO: add api url based on chain id
  return useMemo(
    () => new JsonRpcProvider(process.env.REACT_APP_MAINNET_ALCHEMY_API),
    [chainId]
  )
}
