import { isAddressEqual } from '@indexcoop/tokenlists'
import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { usePublicClient } from 'wagmi'

import { ETH } from '@/constants/tokens'
import { useNetwork } from '@/lib/hooks/use-network'
import { ERC20_ABI } from '@/lib/utils/abi/interfaces'

import type { PublicClient } from 'viem'

export class BalanceProvider {
  constructor(readonly publicClient: PublicClient) {}

  async getErc20Balance(address: string, token: string): Promise<bigint> {
    return await this.publicClient.readContract({
      address: token as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
    })
  }

  async getNativeBalance(address: string) {
    return this.publicClient.getBalance({
      address: address as `0x${string}`,
    })
  }
}

export function useBalance(address?: string, token?: string) {
  const { chainId } = useNetwork()
  const publicClient = usePublicClient({
    chainId,
  })

  const fetchBalance = async () => {
    if (!address || !token || !publicClient) {
      return BigInt(0)
    }

    const balanceProvider = new BalanceProvider(publicClient)
    const isETH = isAddressEqual(token.toLowerCase(), ETH.address)

    return isETH
      ? await balanceProvider.getNativeBalance(address)
      : await balanceProvider.getErc20Balance(address, token)
  }

  const { data: balance = BigInt(0), refetch } = useQuery({
    queryKey: ['balance', address, token, publicClient?.chain.id],
    queryFn: fetchBalance,
    enabled: Boolean(address && token && publicClient),
  })

  return {
    balance: address && token ? balance : BigInt(0),
    forceRefetch: refetch,
  }
}

export interface TokenBalance {
  token: string
  value: bigint
}

export function useBalances(address?: string, tokens?: string[]) {
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

    return balances as TokenBalance[]
  }, [address, tokens, publicClient])

  const { data: balances, refetch } = useQuery({
    initialData: [],
    queryKey: ['balances', chainId, address, tokens?.toString()],
    enabled: Boolean(address && tokens),
    queryFn: fetchBalances,
    select: (data) => data ?? [],
  })

  const forceRefetchBalances = refetch

  return {
    balances,
    forceRefetchBalances,
  }
}
