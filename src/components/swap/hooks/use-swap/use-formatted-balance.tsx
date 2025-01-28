import { useMemo } from 'react'
import { usePublicClient } from 'wagmi'

import { useBalance } from '@/lib/hooks/use-balance'
import { formatWei } from '@/lib/utils'
import { getAddressForToken } from '@/lib/utils/tokens'

import { formattedBalance } from './formatters/index'

export function useFormattedBalance(
  token: { symbol: string; decimals: number },
  address?: string,
) {
  const publicClient = usePublicClient()
  const tokenAddress = getAddressForToken(token.symbol, publicClient?.chain.id)
  const { balance, forceRefetch } = useBalance(address ?? '', tokenAddress)
  const balanceFormatted = useMemo(
    () => formattedBalance(token.decimals, balance),
    [token, balance],
  )
  const balanceWei = useMemo(
    () => formatWei(balance, token.decimals),
    [token, balance],
  )
  return { balance, balanceWei, balanceFormatted, forceRefetch }
}
