import { useCallback, useEffect, useState } from 'react'

import { ethers, utils } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { useEthers, useSendTransaction, useTokenAllowance } from '@usedapp/core'

import { Token } from 'constants/tokens'
import { ERC20_ABI } from 'utils/abi/ERC20'
import { getAddressForToken } from 'utils/tokens'

const ERC20Interface = new utils.Interface(ERC20_ABI)

enum ApprovalState {
  Approved,
  // Pending
  NotApproved,
  Unknown,
}

function useApprovalState(
  amountToApprove: BigNumber,
  tokenAddress?: string,
  spenderAddress?: string
): ApprovalState {
  const { account } = useEthers()
  const allowance = useTokenAllowance(tokenAddress, account, spenderAddress)

  if (!tokenAddress || !spenderAddress || !allowance) {
    return ApprovalState.Unknown
  }

  const isApproved = allowance.gte(amountToApprove) ?? false

  // TODO: we'd actually have to test for pending approval as well here
  return isApproved ? ApprovalState.Approved : ApprovalState.NotApproved
}

/**
 * Approve the spending of an ERC20
 */
export const useApproval = (
  token?: Token,
  spenderAddress?: string,
  amount: BigNumber = ethers.constants.MaxUint256
) => {
  const { account, chainId, library } = useEthers()
  const { sendTransaction, state } = useSendTransaction()

  const tokenAddress = token && getAddressForToken(token, chainId)
  const approvalState = useApprovalState(amount, tokenAddress, spenderAddress)

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
      const tx = await tokenContract.approve(spenderAddress, amount)
      await sendTransaction(tx)
    } catch (e) {
      console.log('Error approving token', tokenAddress, e)
      setIsApproving(false)
      return false
    }
  }, [
    account,
    amount,
    library,
    setIsApproved,
    setIsApproving,
    spenderAddress,
    tokenAddress,
  ])

  useEffect(() => {
    setIsApproved(approvalState === ApprovalState.Approved)
  }, [approvalState])

  useEffect(() => {
    const txIsFinished =
      state.status === 'Success' ||
      state.status === 'Fail' ||
      state.status === 'Exception'
    if (txIsFinished) {
      setIsApproved(state.status !== 'Fail')
      setIsApproving(false)
    }
  }, [state])

  return {
    isApproved,
    isApproving,
    onApprove: handleApprove,
  }
}
