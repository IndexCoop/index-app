import { useCallback, useEffect, useState } from 'react'

import { constants, utils } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { useTokenAllowance, useTransactions } from '@usedapp/core'

import { Token } from 'constants/tokens'
import { useAccount } from 'hooks/useAccount'
import { useNetwork } from 'hooks/useNetwork'
import { ERC20_ABI } from 'utils/abi/ERC20'
import { getStoredTransaction } from 'utils/storedTransaction'
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
  const { account } = useAccount()
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
  amount: BigNumber = constants.MaxUint256
) => {
  const { account, provider } = useAccount()
  const { chainId } = useNetwork()
  const { addTransaction } = useTransactions()

  const tokenAddress = token && getAddressForToken(token, chainId)
  const approvalState = useApprovalState(amount, tokenAddress, spenderAddress)

  const [isApproving, setIsApproving] = useState(false)
  const [isApproved, setIsApproved] = useState(false)

  const handleApprove = useCallback(async () => {
    if (!provider || !account || !tokenAddress || !spenderAddress) {
      return
    }
    try {
      setIsApproving(true)
      const tokenContract = new Contract(
        tokenAddress,
        ERC20Interface,
        provider.getSigner()
      )
      const tx = await tokenContract.approve(spenderAddress, amount)
      if (tx) {
        const storedTx = getStoredTransaction(tx, chainId)
        addTransaction(storedTx)
      }
      const receipt = await tx.wait()
      setIsApproved(receipt.status === 1)
      setIsApproving(false)
    } catch (e) {
      setIsApproving(false)
      console.error('Error approving token', tokenAddress, e)
    }
  }, [
    account,
    amount,
    provider,
    setIsApproved,
    setIsApproving,
    spenderAddress,
    tokenAddress,
  ])

  useEffect(() => {
    setIsApproved(approvalState === ApprovalState.Approved)
  }, [approvalState])

  return {
    isApproved,
    isApproving,
    onApprove: handleApprove,
  }
}
