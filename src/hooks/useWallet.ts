import { useAccount, useProvider, useSigner } from 'wagmi'

import { JsonRpcProvider } from '@ethersproject/providers'

type Account = {
  address: string | null | undefined
  provider: any | undefined
  signer: any | undefined
}

// A wrapper to be able to easily exchange how we retrieve the account
export const useWallet = (): Account => {
  const { address } = useAccount()
  const provider = useProvider()
  const { data: signer } = useSigner()
  return { address, provider, signer }
}
