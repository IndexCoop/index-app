import { useMemo } from 'react'
import { isAddress } from 'viem'
import { Address, useContractRead, useContractWrite } from 'wagmi'

import { ETH, Token } from '@/constants/tokens'
import { useWallet } from '@/lib/hooks/use-wallet'
import { ERC20_ABI } from '@/lib/utils/abi/interfaces'

export const useApproval = (
  token: Token,
  spenderAddress: string | null,
  amount: bigint,
) => {
  const { address } = useWallet()

  const { data } = useContractRead({
    address: token.address as Address,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [address as Address, spenderAddress as Address],
    enabled:
      typeof token.address === 'string' &&
      isAddress(token.address) &&
      token.symbol !== ETH.symbol,
  })

  const { isLoading: isApproving, write: approve } = useContractWrite({
    address: token.address as Address,
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [spenderAddress as Address, amount],
  })

  const isApproved = useMemo(() => {
    if (token.symbol === 'ETH') return true
    return data ? data >= amount : false
  }, [amount, data, token])

  return { approve, isApproved, isApproving }
}
