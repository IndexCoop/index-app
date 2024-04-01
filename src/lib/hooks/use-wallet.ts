import { providers } from 'ethers'
import { Hex, HttpTransport, PublicClient } from 'viem'
import { useAccount, usePublicClient } from 'wagmi'

import { useNetwork } from '@/lib/hooks/use-network'

export interface IndexRpcProvider {
  estimateGas(tx: any): Promise<bigint>
  getGasPrice(): Promise<bigint>
}

type Account = {
  address: Hex | undefined
  // Convenience property to be used until we can fully get rid of this ethers provider
  jsonRpcProvider: providers.JsonRpcProvider
  provider: IndexRpcProvider
  isConnected: boolean
}

function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient
  const network = {
    chainId: chain?.id ?? 1,
    name: chain?.name ?? '',
    ensAddress: chain?.contracts?.ensRegistry?.address,
  }
  const url = (transport.transports as ReturnType<HttpTransport>[]).map(
    ({ value }) => new providers.JsonRpcProvider(value?.url, network),
  )[0].connection.url
  return new providers.JsonRpcProvider(url, network)
}

// A wrapper to be able to easily exchange how we retrieve the account
export const useWallet = (): Account => {
  const { address } = useAccount()
  const { chainId } = useNetwork()
  const publicClient = usePublicClient({ chainId })
  const jsonRpcProvider = publicClientToProvider(publicClient)
  const isConnected = !!address
  return {
    address,
    isConnected,
    jsonRpcProvider,
    provider: publicClient,
  }
}
