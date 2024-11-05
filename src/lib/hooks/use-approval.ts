import { useCallback, useMemo, useState } from 'react'
import { Address } from 'viem'
import { usePublicClient, useReadContract, useWalletClient } from 'wagmi'

import { ETH, Token } from '@/constants/tokens'
import { useWallet } from '@/lib/hooks/use-wallet'
import { isAddress } from '@/lib/utils'
import { ERC20_ABI } from '@/lib/utils/abi/interfaces'
import { getAddressForToken } from '@/lib/utils/tokens'

export const useApproval = (
  token: Token,
  spenderAddress: string | null,
  amount: bigint,
) => {
  const publicClient = usePublicClient()
  const { address } = useWallet()
  const { data: walletClient } = useWalletClient()

  const [isApproving, setIsApproving] = useState(false)

  const tokenAddress = useMemo(() => {
    if (!publicClient) return null
    const chainId = publicClient?.chain.id
    return getAddressForToken(token, chainId) ?? null
  }, [publicClient, token])

  const { data, refetch } = useReadContract({
    address: tokenAddress as Address,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [address as Address, spenderAddress as Address],
    query: {
      enabled:
        typeof tokenAddress === 'string' &&
        isAddress(tokenAddress) &&
        token.symbol !== ETH.symbol,
    },
  })

  const isApproved = useMemo(() => {
    if (token.symbol === 'ETH') return true
    if (isApproving) return false
    return data ? data >= amount : false
  }, [amount, data, isApproving, token])

  const approve = useCallback(async () => {
    if (!publicClient || !walletClient) return false
    setIsApproving(true)
    try {
      const hash = await walletClient.writeContract({
        address: tokenAddress as Address,
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
      return true
    } catch {
      setIsApproving(false)
      return false
    }
  }, [
    amount,
    publicClient,
    refetch,
    spenderAddress,
    tokenAddress,
    walletClient,
  ])

  return { approve, isApproved, isApproving }
}
