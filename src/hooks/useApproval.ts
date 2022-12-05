import { useCallback, useEffect, useState } from 'react'

import { constants } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'

import { Token } from 'constants/tokens'
import { useNetwork } from 'hooks/useNetwork'
import { useWallet } from 'hooks/useWallet'
import { getERC20Contract } from 'utils/contracts'
import { getAddressForToken } from 'utils/tokens'

export const useApproval = (
  token: Token,
  spenderAddress: string | null,
  amount: BigNumber = constants.MaxUint256
) => {
  const { address, provider, signer } = useWallet()
  const { chainId } = useNetwork()

  const [isApproved, setIsApproved] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

  const tokenAddress = (token && getAddressForToken(token, chainId)) || ''

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
    if (!spenderAddress || isApproving) return
    updateApprovalState(spenderAddress)
  }, [amount, isApproving, spenderAddress])

  return { approve, isApproved, isApproving }
}
