import { useCallback, useEffect, useState } from 'react'

import { constants, utils } from 'ethers'
import { useContractRead, useNetwork } from 'wagmi'

import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'

import { Token } from 'constants/tokens'
import { useWallet } from 'hooks/useWallet'
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
  const { address } = useWallet()
  const { data, isError, isLoading } = useContractRead({
    addressOrName: tokenAddress ?? '',
    contractInterface: ERC20Interface,
    functionName: 'allowance',
    args: [address, spenderAddress],
  })
  // console.log('data', data)

  if (!tokenAddress || !spenderAddress || !data) {
    return ApprovalState.Unknown
  }

  const isApproved = data.gte(amountToApprove) ?? false

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
  const { address, provider } = useWallet()
  const { chain } = useNetwork()

  const tokenAddress = token && getAddressForToken(token, chain?.id)
  const approvalState = useApprovalState(amount, tokenAddress, spenderAddress)

  const [isApproving, setIsApproving] = useState(false)
  const [isApproved, setIsApproved] = useState(false)

  const handleApprove = useCallback(async () => {
    if (!provider || !address || !tokenAddress || !spenderAddress) {
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
      // TODO:
      // if (tx) {
      //   const storedTx = getStoredTransaction(tx, chain?.id)
      //   addTransaction(storedTx)
      // }
      const receipt = await tx.wait()
      setIsApproved(receipt.status === 1)
      setIsApproving(false)
    } catch (e) {
      setIsApproving(false)
      console.error('Error approving token', tokenAddress, e)
    }
  }, [
    address,
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
