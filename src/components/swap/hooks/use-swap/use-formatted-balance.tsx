import { formatUnits } from '@ethersproject/units'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { usePublicClient } from 'wagmi'

import { Token } from '@/constants/tokens'
import { useBalance } from '@/lib/hooks/use-balance'
import { getAddressForToken } from '@/lib/utils/tokens'

import { formattedBalance } from './formatters/index'

export function useFormattedBalance(token: Token, address?: string) {
  const publicClient = usePublicClient()
  const tokenAddress = getAddressForToken(token, publicClient?.chain.id)
  const { balance, forceRefetch } = useBalance(address ?? '', tokenAddress)
  const balanceFormatted = useMemo(
    () => formattedBalance(token, BigNumber.from(balance.toString())),
    [token, balance],
  )
  const balanceWei = useMemo(
    () => formatUnits(balance, token.decimals),
    [token, balance],
  )
  return { balance, balanceWei, balanceFormatted, forceRefetch }
}
