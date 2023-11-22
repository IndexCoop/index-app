import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { formatUnits } from '@ethersproject/units'

import { Token } from '@/constants/tokens'
import { useBalance } from '@/lib/hooks/use-balance'

import { formattedBalance } from './formatters/index'

export function useFormattedBalance(token: Token, address?: string) {
  const balance = useBalance(address ?? '', token.address)
  const balanceFormatted = useMemo(
    () => formattedBalance(token, BigNumber.from(balance.toString())),
    [token, balance]
  )
  const balanceWei = useMemo(
    () => formatUnits(balance, token.decimals),
    [token, balance]
  )
  return { balance, balanceWei, balanceFormatted }
}
