import { useAccount, useProvider, useSigner } from 'wagmi'

type Account = {
  address: string | null | undefined
  provider: any | undefined
  signer: any | undefined
  isConnected: boolean
}

// A wrapper to be able to easily exchange how we retrieve the account
export const useWallet = (): Account => {
  const { address } = useAccount()
  const provider = useProvider()
  const { data: signer } = useSigner()
  const isConnected = !!address
  return { address, provider, signer, isConnected }
}
