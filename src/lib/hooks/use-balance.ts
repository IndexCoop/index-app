import { useCallback, useEffect, useMemo, useState } from 'react'
import { PublicClient } from 'viem'
import { usePublicClient } from 'wagmi'

import { ETH } from '@/constants/tokens'
import { useNetwork } from '@/lib/hooks/use-network'
import { ERC20_ABI } from '@/lib/utils/abi/interfaces'

export class BalanceProvider {
  constructor(readonly publicClient: PublicClient) {}

  async getErc20Balance(address: string, token: string): Promise<bigint> {
    return await this.publicClient.readContract({
      address: token,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address],
    })
  }

  async getNativeBalance(address: string) {
    return this.publicClient.getBalance({
      address: address,
    })
  }
}

export function useBalance(address?: string, token?: string) {
  const [balance, setBalance] = useState<bigint>(BigInt(0))
  const { chainId } = useNetwork()

  const publicClient = usePublicClient({
    chainId,
  })

  const fetchBalance = useCallback(async () => {
    if (!address || !token || !publicClient) {
      setBalance(BigInt(0))
      return
    }

    const balanceProvider = new BalanceProvider(publicClient)
    const isETH = token.toLowerCase() === ETH.address!.toLowerCase()
    const balance = isETH
      ? await balanceProvider.getNativeBalance(address)
      : await balanceProvider.getErc20Balance(address, token)
    setBalance(balance)
  }, [address, token, publicClient])

  const forceRefetch = () => {
    fetchBalance()
  }

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return {
    balance: useMemo(() => {
      if (address && token) return balance
      return BigInt(0)
    }, [address, balance, token]),
    forceRefetch,
  }
}

export interface TokenBalance {
  token: string
  value: bigint
}

export function useBalances(address?: string, tokens?: string[]) {
  const [balances, setBalances] = useState<TokenBalance[]>([])
  const { chainId } = useNetwork()
  const publicClient = usePublicClient({
    chainId,
  })

  const fetchBalances = useCallback(async () => {
    if (!address || !publicClient || !tokens || tokens.length === 0) return
    const balanceProvider = new BalanceProvider(publicClient)
    const promises = tokens.map((token) => {
      if (token.length === 0) return BigInt(0)

      const isETH = token.toLowerCase() === ETH.address!.toLowerCase()
      const balance = isETH
        ? balanceProvider.getNativeBalance(address)
        : balanceProvider.getErc20Balance(address, token)
      return balance
    })
    const results = await Promise.all(promises)
    const balances = tokens.map((token, index) => {
      return { token: token, value: results[index] }
    })
    setBalances(balances)
  }, [address, tokens, publicClient])

  useEffect(() => {
    fetchBalances()
  }, [fetchBalances])

  const memoizedBalances = useMemo(() => {
    if (address && tokens) return balances
    return []
  }, [address, balances, tokens])

  const forceRefetchBalances = () => {
    fetchBalances()
  }

  return {
    balances: memoizedBalances,
    forceRefetchBalances,
  }
}
