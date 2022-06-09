import { Web3Provider } from '@ethersproject/providers'
import { useEthers } from '@usedapp/core'

type Account = {
  account: string | null | undefined
  provider: Web3Provider | undefined
}

// A wrapper to be able to easily exchange how we retrieve the account
export const useAccount = (): Account => {
  const { account, library } = useEthers()
  return { account, provider: library }
}
