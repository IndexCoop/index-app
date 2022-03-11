import { useCallback, useEffect, useState } from 'react'

import { ethers, utils } from 'ethers'

import { Contract } from '@ethersproject/contracts'
import { useEthers, useSendTransaction } from '@usedapp/core'

import { minimumRequiredApprovalQuantity } from 'constants/index'
import { useAllowance } from 'hooks/useAllowance'
import { ERC20_ABI } from 'utils/abi/ERC20'

const ERC20Interface = new utils.Interface(ERC20_ABI)

/**
 * Approve the spending of an ERC20
 */
export const useApproval = (tokenAddress?: string, spenderAddress?: string) => {
  const { account, library } = useEthers()
  const allowance = useAllowance(tokenAddress, spenderAddress)
  const { sendTransaction, state } = useSendTransaction()

  const [isApproving, setIsApproving] = useState(false)
  const [isApproved, setIsApproved] = useState(false)

  const handleApprove = useCallback(async () => {
    if (!library || !account || !tokenAddress || !spenderAddress) {
      return
    }
    try {
      setIsApproving(true)
      const tokenContract = new Contract(
        tokenAddress,
        ERC20Interface,
        library.getSigner()
      )
      const tx = await tokenContract.approve(
        spenderAddress,
        ethers.constants.MaxUint256
      )
      await sendTransaction(tx)
    } catch (e) {
      console.log('Error approving token', tokenAddress, e)
      setIsApproving(false)
      return false
    }
  }, [
    account,
    library,
    setIsApproved,
    setIsApproving,
    spenderAddress,
    tokenAddress,
  ])

  useEffect(() => {
    const isApproved = allowance?.gte(minimumRequiredApprovalQuantity) ?? false
    setIsApproved(isApproved)
  }, [allowance])

  useEffect(() => {
    setIsApproving(false)
    setIsApproved(state.status === 'Success')
  }, [state])

  return {
    isApproved,
    isApproving,
    onApprove: handleApprove,
  }
}
