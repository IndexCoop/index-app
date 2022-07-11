import { useCallback, useEffect, useState } from 'react'

import { constants, utils } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { useTokenAllowance, useTransactions } from '@usedapp/core'

import { Token } from 'constants/tokens'
import { useAccount } from 'hooks/useAccount'
import { useNetwork } from 'hooks/useNetwork'
import { ISSUANCE_ABI } from 'utils/abi/ISSUANCE'
import { getStoredTransaction } from 'utils/storedTransaction'
import { IssuanceContractAddress } from 'constants/ethContractAddresses'

const ISSUANCEInterface = new utils.Interface(ISSUANCE_ABI)

/**
 * Approve the spending of an ERC20
 */
export const useIssuance = (
  token?: Token,
  amount?: BigNumber,
  maxAmount?: BigNumber,
  isIssue?: boolean
) => {
  const { account, provider } = useAccount()
  const { chainId } = useNetwork()
  const { addTransaction } = useTransactions()

  const [isTrading, setIsTrading] = useState(false)

  const handleTrade = useCallback(async () => {

    if (!provider || !account || !token?.optimismAddress) {
      return
    }
    try {
      setIsTrading(true)
      const tokenContract = new Contract(
        IssuanceContractAddress,
        ISSUANCEInterface,
        provider.getSigner()
      )
      if (isIssue) {
        const tx = await tokenContract.issueFixedSetFromUsdc(token.optimismAddress, amount, maxAmount)
        if (tx) {
          const storedTx = getStoredTransaction(tx, chainId)
          addTransaction(storedTx)
        }
        const receipt = await tx.wait()
        setIsTrading(false)
      } else {
        const tx = await tokenContract.redeemFixedSetForUsdc(token.optimismAddress, amount, maxAmount)
        if (tx) {
          const storedTx = getStoredTransaction(tx, chainId)
          addTransaction(storedTx)
        }
        const receipt = await tx.wait()
        setIsTrading(false)
      }
    } catch (e) {
      setIsTrading(false)
      console.log('Error sending transaction', e)
    }
  }, [
    account,
    amount,
    maxAmount,
    provider,
    setIsTrading,
    token,
  ])

  return {
    isTrading,
    handleTrade,
  }
}
