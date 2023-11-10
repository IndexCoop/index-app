import { useEffect, useMemo, useState } from 'react'
import { Address, PublicClient, usePublicClient } from 'wagmi'

import { ETH } from '@/constants/tokens'
import { ERC20_ABI } from '@/lib/utils/abi/interfaces'

class BalanceProvider {
  constructor(readonly publicClient: PublicClient) {}

  async getErc20Balance(address: string, token: string): Promise<bigint> {
    return await this.publicClient.readContract({
      address: token as Address,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address as Address],
    })
  }

  async getNativeBalance(address: string) {
    return await this.publicClient.getBalance({
      address: address as Address,
    })
  }
}

export function useBalance(address?: string, token?: string) {
  const publicClient = usePublicClient()
  const [balance, setBalance] = useState<bigint>(BigInt(0))

  useEffect(() => {
    async function fetchBalance() {
      if (!address || !token) return
      const balanceProvider = new BalanceProvider(publicClient)
      const isETH = token.toLowerCase() === ETH.address!.toLowerCase()
      console.log('fetching', token, isETH)
      const balance = isETH
        ? await balanceProvider.getNativeBalance(address)
        : await balanceProvider.getErc20Balance(address, token)
      setBalance(balance)
    }
    fetchBalance()
  }, [address, token, publicClient])

  return useMemo(() => {
    if (address && token) return balance
    return BigInt(0)
  }, [address, balance, token])
}
