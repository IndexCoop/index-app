import { formatUnits } from '@ethersproject/units'
import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { usePublicClient } from 'wagmi'

import { Token } from '@/constants/tokens'
import { useBalance } from '@/lib/hooks/use-balance'

import { formattedBalance } from './formatters/index'

export function useFormattedBalance(token: Token, address?: string) {
  const publicClient = usePublicClient()
  const tokenAddress = getTokenByChainAndSymbol(
    publicClient?.chain.id,
    token.symbol,
  )?.address
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
