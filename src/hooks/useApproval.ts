import { useCallback, useEffect, useMemo, useState } from 'react'

import { constants, Contract, utils } from 'ethers'
import {
  useContract,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from 'wagmi'

import { BigNumber } from '@ethersproject/bignumber'

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

  let isApproved = false
  if (data) {
    isApproved = data.gte(amountToApprove)
  }

  // TODO: we'd actually have to test for pending approval as well here
  return useMemo(
    () =>
      tokenAddress && spenderAddress && data && !isError && !isLoading
        ? isApproved
          ? ApprovalState.Approved
          : ApprovalState.NotApproved
        : ApprovalState.Unknown,
    [tokenAddress, spenderAddress]
  )
}

/**
 * Approve the spending of an ERC20
 */
export const useApproval = (
  token?: Token,
  spenderAddress?: string,
  amount: BigNumber = constants.MaxUint256
) => {
  const { address, signer } = useWallet()
  const { chain } = useNetwork()

  const tokenAddress = (token && getAddressForToken(token, chain?.id)) || ''
  const approvalState = useApprovalState(amount, tokenAddress, spenderAddress)

  const [isApproving, setIsApproving] = useState(false)
  const [isApproved, setIsApproved] = useState(false)

  // const tokenContract = useContract({
  //   addressOrName: tokenAddress,
  //   contractInterface: ERC20Interface,
  //   signerOrProvider: signer,
  // })

  const handleApprove = useCallback(async () => {
    if (!signer || !address || !tokenAddress || !spenderAddress) {
      return
    }
    try {
      setIsApproving(true)
      const contract = new Contract(tokenAddress, ERC20Interface, signer)
      const tx = await contract.approve(spenderAddress, amount)
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
    signer,
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

/** currently unused, testing wagmi version */
export const useNewApproveToken = (
  token: Token,
  spenderAddress: string,
  amount: BigNumber = constants.MaxUint256,
  chainId: number
) => {
  const tokenAddress = (token && getAddressForToken(token, chainId)) || ''
  const { config } = usePrepareContractWrite({
    addressOrName: tokenAddress,
    contractInterface: ERC20Interface,
    functionName: 'approve',
    args: [spenderAddress, amount],
  })
  const { data, isLoading, isSuccess, write } = useContractWrite(config)
  return {
    data,
    isLoading,
    isSuccess,
    write,
  }
}
