import { useEthers } from '@usedapp/core'

type Account = string | null | undefined

// A wrapper to be able to easily exchange how we retrieve the account
export const useAccount = (): { account: Account } => {
  const { account } = useEthers()
  return { account }
}
