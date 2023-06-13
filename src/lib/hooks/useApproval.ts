import { useCallback, useEffect, useState } from 'react'

import { constants } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'

import { Token } from '@/constants/tokens'
import { useNetwork } from '@/lib/hooks/useNetwork'
import { useWallet } from '@/lib/hooks/useWallet'
import { getERC20Contract } from '@/lib/utils/contracts'
import { getAddressForToken, isNativeCurrency } from '@/lib/utils/tokens'

export const useApproval = (
  token: Token,
  spenderAddress: string | null,
  amount: BigNumber = constants.MaxUint256
) => {
  const { address, provider, signer } = useWallet()
  const { chainId } = useNetwork()

  const [isApproved, setIsApproved] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

  const isNative = isNativeCurrency(token, chainId ?? 1)
  const tokenAddress = isNative
    ? ''
    : (token && getAddressForToken(token, chainId)) || ''

  const approve = useCallback(async () => {
    if (!signer || !address || !tokenAddress || !spenderAddress) return
    try {
      setIsApproving(true)
      const contract = getERC20Contract(tokenAddress, signer)
      const tx = await contract.approve(spenderAddress, amount)
      await tx.wait()
      setIsApproving(false)
    } catch (e) {
      setIsApproving(false)
      console.warn('Error approving token', tokenAddress, e)
    }
  }, [address, amount, signer, spenderAddress, tokenAddress])

  async function getAllowance(spenderAddress: string) {
    const erc20 = getERC20Contract(tokenAddress, provider)
    const allowance = await erc20.allowance(address, spenderAddress)
    return allowance
  }

  async function updateApprovalState(spenderAddress: string) {
    const allowance = await getAllowance(spenderAddress)
    const isApproved = allowance.gte(amount)
    setIsApproved(isApproved)
  }

  useEffect(() => {
    if (!spenderAddress || !tokenAddress || isApproving) return
    updateApprovalState(spenderAddress)
  }, [amount, isApproving, spenderAddress, tokenAddress, updateApprovalState])

  return { approve, isApproved, isApproving }
}
