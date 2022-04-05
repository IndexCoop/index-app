import { useCallback, useEffect, useState } from 'react'

import { ethers, utils } from 'ethers'

import { Contract } from '@ethersproject/contracts'
import { ChainId, useEthers, useSendTransaction } from '@usedapp/core'

import { minimumRequiredApprovalQuantity } from 'constants/index'
import { Token } from 'constants/tokens'
import { useAllowance } from 'hooks/useAllowance'
import { ERC20_ABI } from 'utils/abi/ERC20'

import {
  ExchangeIssuanceLeveragedPolygonAddress,
  ExchangeIssuanceLeveragedMainnetAddress,
} from 'constants/ethContractAddresses'

const ERC20Interface = new utils.Interface(ERC20_ABI)

/**
 * Approve the spending of an ERC20
 */
export const useApproval = (token?: Token, spenderAddress?: string) => {
  const { account, chainId, library } = useEthers()
  const tokenAddress =
    chainId === ChainId.Polygon ? token?.polygonAddress : token?.address

  if (spenderAddress === ExchangeIssuanceLeveragedMainnetAddress &&
  chainId === ChainId.Polygon) {
    spenderAddress = ExchangeIssuanceLeveragedPolygonAddress
  }
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
    setIsApproved(state.status === 'Success')
    if (isApproved) setIsApproving(false)
  }, [state])

  return {
    isApproved,
    isApproving,
    onApprove: handleApprove,
  }
}
