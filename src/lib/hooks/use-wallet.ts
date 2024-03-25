import { providers } from 'ethers'
import { useEffect, useState } from 'react'
import { Hex } from 'viem'
import { useAccount, useNetwork, usePublicClient, useWalletClient } from 'wagmi'

import { getEthersSigner } from '../utils/ethers-adapters'

interface IndexRpcProvider {
  estimateGas(tx: any): Promise<bigint>
  getGasPrice(): Promise<bigint>
}

type Account = {
  address: Hex | undefined
  provider: IndexRpcProvider
  signer: any | undefined
  isConnected: boolean
}

// A wrapper to be able to easily exchange how we retrieve the account
export const useWallet = (): Account => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient({ chainId: chain?.id })
  const isConnected = !!address
  const [signer, setSigner] = useState<providers.JsonRpcSigner | undefined>(
    undefined,
  )
  useEffect(() => {
    const fetchSigner = async () => {
      const signer = await getEthersSigner({ chainId: chain?.id })
      setSigner(signer)
    }
    if (walletClient && chain) {
      fetchSigner()
    }
  }, [chain, walletClient])
  return { address, provider: publicClient, signer, isConnected }
}
