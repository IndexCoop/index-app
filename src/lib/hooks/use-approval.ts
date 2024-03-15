import { useCallback, useState, useMemo } from 'react'
import { isAddress } from 'viem'
import {
  Address,
  useContractRead,
  usePublicClient,
  useWalletClient,
} from 'wagmi'

import { ETH, Token } from '@/constants/tokens'
import { useWallet } from '@/lib/hooks/use-wallet'
import { ERC20_ABI } from '@/lib/utils/abi/interfaces'

export const useApproval = (
  token: Token,
  spenderAddress: string | null,
  amount: bigint,
) => {
  const publicClient = usePublicClient()
  const { address } = useWallet()
  const { data: walletClient } = useWalletClient()

  const [isApproving, setIsApproving] = useState(false)

  const { data, refetch } = useContractRead({
    address: token.address as Address,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [address as Address, spenderAddress as Address],
    enabled:
      typeof token.address === 'string' &&
      isAddress(token.address) &&
      token.symbol !== ETH.symbol,
  })

  const isApproved = useMemo(() => {
    if (token.symbol === 'ETH') return true
    if (isApproving) return false
    return data ? data >= amount : false
  }, [amount, data, isApproving, token])

  const approve = useCallback(async () => {
    if (!walletClient) return
    setIsApproving(true)
    const hash = await walletClient.writeContract({
      address: token.address as Address,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spenderAddress as Address, amount],
    })
    await publicClient.waitForTransactionReceipt({
      confirmations: 1,
      hash,
    })
    await refetch()
    setIsApproving(false)
  }, [
    amount,
    publicClient,
    refetch,
    spenderAddress,
    token.address,
    walletClient,
  ])

  return { approve, isApproved, isApproving }
}
