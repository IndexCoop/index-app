import { useAccount, useProvider } from 'wagmi'

import { JsonRpcProvider } from '@ethersproject/providers'

type Account = {
  address: string | null | undefined
  provider: JsonRpcProvider | undefined
}

// A wrapper to be able to easily exchange how we retrieve the account
export const useWallet = (): Account => {
  const { address } = useAccount()
  const provider = useProvider() as JsonRpcProvider
  return { address, provider }
}
