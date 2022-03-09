import { useCallback, useEffect, useState } from 'react'

import { ethers, utils } from 'ethers'

import { Contract } from '@ethersproject/contracts'
import { useContractFunction, useEthers } from '@usedapp/core'

import { minimumRequiredApprovalQuantity } from 'constants/index'
import { useAllowance } from 'hooks/useAllowance'
import { ERC20_ABI } from 'utils/abi/ERC20'

const ERC20Interface = new utils.Interface(ERC20_ABI)

/**
 * Approve the spending of an ERC20
 */
export const useApproval = (tokenAddress: string, spenderAddress: string) => {
  const { account, library } = useEthers()
  const allowance = useAllowance(tokenAddress, spenderAddress)

  const [isApproving, setIsApproving] = useState(false)
  const [isApproved, setIsApproved] = useState(false)

  const tokenContract = new Contract(tokenAddress, ERC20Interface)
  const { state, send: approveSpend } = useContractFunction(
    tokenContract,
    'approve'
  )

  const handleApprove = useCallback(() => {
    if (!library || !account || !tokenAddress || !spenderAddress) {
      return
    }
    try {
      setIsApproving(true)
      approveSpend(spenderAddress, ethers.constants.MaxUint256)
    } catch (e) {
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
    if (state.status !== 'Success') {
      setIsApproving(false)
    }

    if (allowance?.gte(minimumRequiredApprovalQuantity)) {
      setIsApproved(true)
    }
  }, [state, allowance])

  return {
    isApproved,
    isApproving,
    onApprove: handleApprove,
  }
}
