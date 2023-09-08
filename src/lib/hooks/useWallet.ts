import { providers } from 'ethers'
import { useEffect, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'

import { getEthersProvider, getEthersSigner } from '../utils/ethers-adapters'

type Account = {
  address: string | null | undefined
  provider: any | undefined
  signer: any | undefined
  isConnected: boolean
}

// A wrapper to be able to easily exchange how we retrieve the account
export const useWallet = (): Account => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const provider = getEthersProvider({ chainId: chain?.id })
  const isConnected = !!address
  const [signer, setSigner] = useState<providers.JsonRpcSigner | undefined>(
    undefined
  )
  useEffect(() => {
    const fetchSigner = async () => {
      const signer = await getEthersSigner({ chainId: chain?.id })
      setSigner(signer)
    }
    fetchSigner()
  }, [chain])
  return { address, provider, signer, isConnected }
}
