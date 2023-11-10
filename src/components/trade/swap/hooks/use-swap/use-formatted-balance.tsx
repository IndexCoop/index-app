import { BigNumber } from 'ethers'
import { formatUnits } from '@ethersproject/units'

import { Token } from '@/constants/tokens'
import { useBalance } from '@/lib/hooks/use-balance'

import { formattedBalance } from '../../../_shared/QuickTradeFormatter'

export function useFormattedBalance(token: Token, address?: string) {
  const balance = useBalance(address ?? '', token.address)
  const balanceFormatted = formattedBalance(
    token,
    BigNumber.from(balance.toString())
  )
  const balanceWei = formatUnits(balance, token.decimals)
  return { balance, balanceWei, balanceFormatted }
}
