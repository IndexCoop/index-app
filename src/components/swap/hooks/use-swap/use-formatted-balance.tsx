import { useMemo } from 'react'
import { usePublicClient } from 'wagmi'

import { Token } from '@/constants/tokens'
import { useBalance } from '@/lib/hooks/use-balance'
import { formatWei } from '@/lib/utils'
import { getAddressForToken } from '@/lib/utils/tokens'

import { formattedBalance } from './formatters/index'

export function useFormattedBalance(token: Token, address?: string) {
  const publicClient = usePublicClient()
  const tokenAddress = getAddressForToken(token, publicClient?.chain.id)
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
