import { useAccount, usePublicClient } from 'wagmi'

import { useNetwork } from '@/lib/hooks/use-network'

export interface IndexRpcProvider {
  estimateGas(tx: any): Promise<bigint>
  getGasPrice(): Promise<bigint>
}

type Account = {
  address: string | undefined
  provider: IndexRpcProvider | null
  isConnected: boolean
  rpcUrl: string
}

// A wrapper to be able to easily exchange how we retrieve the account
export const useWallet = (): Account => {
  const { address } = useAccount()
  const { chainId } = useNetwork()
  const publicClient = usePublicClient({ chainId })
  const isConnected = !!address
  return {
    address,
    isConnected,
    provider: publicClient ?? null,
    rpcUrl: publicClient?.transport.url ?? '',
  }
}
