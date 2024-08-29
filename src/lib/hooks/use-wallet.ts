import { providers } from 'ethers'
import { PublicClient } from 'viem'
import { useAccount, usePublicClient } from 'wagmi'

import { useNetwork } from '@/lib/hooks/use-network'

export interface IndexRpcProvider {
  estimateGas(tx: any): Promise<bigint>
  getGasPrice(): Promise<bigint>
}

type Account = {
  address: string | undefined
  // Convenience property to be used until we can fully get rid of this ethers provider
  jsonRpcProvider: providers.JsonRpcProvider | null
  provider: IndexRpcProvider | null
  isConnected: boolean
  rpcUrl: string
}

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient
  const network = {
    chainId: chain?.id ?? 1,
    name: chain?.name ?? '',
    ensAddress: chain?.contracts?.ensRegistry?.address,
  }
  return new providers.JsonRpcProvider(transport.url, network)
}

// A wrapper to be able to easily exchange how we retrieve the account
export const useWallet = (): Account => {
  const { address } = useAccount()
  const { chainId } = useNetwork()
  const publicClient = usePublicClient({ chainId })
  const jsonRpcProvider = publicClient
    ? publicClientToProvider(publicClient)
    : null
  const isConnected = !!address
  return {
    address,
    isConnected,
    jsonRpcProvider,
    provider: publicClient ?? null,
    rpcUrl: publicClient?.transport.url ?? '',
  }
}
