import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { useWallet } from './useWallet'

/**
 * Returns the balance for the native token of the connected chain
 */
export const useEthBalance = (chainId: number) => {
  const [balance, setBalance] = useState(BigNumber.from(0))
  const { address, provider } = useWallet()

  useEffect(() => {
    if (!address || !chainId) return
    const fetchBalance = async () => {
      const balance = await provider.getBalance(address)
      setBalance(balance)
    }
    fetchBalance()
  }, [address, chainId])

  return balance
}
