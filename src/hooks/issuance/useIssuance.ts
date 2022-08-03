import { useCallback, useState } from 'react'

import { utils } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'

import { FlashMintPerp } from 'constants/ethContractAddresses'
import { Token } from 'constants/tokens'
import { useWallet } from 'hooks/useWallet'
import { ISSUANCE_ABI } from 'utils/abi/Issuance'

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
  const { address, signer } = useWallet()

  const [isTrading, setIsTrading] = useState(false)

  const handleTrade = useCallback(async () => {
    if (!signer || !address || !token?.optimismAddress) {
      return
    }
    try {
      setIsTrading(true)
      const tokenContract = new Contract(
        FlashMintPerp,
        ISSUANCEInterface,
        signer
      )
      if (isIssue) {
        const tx = await tokenContract.issueFixedSetFromUsdc(
          token.optimismAddress,
          amount,
          maxAmount
        )
        // if (tx) {
        //   const storedTx = getStoredTransaction(tx, chainId)
        //   addTransaction(storedTx)
        // }
        const receipt = await tx.wait()
        setIsTrading(false)
      } else {
        const tx = await tokenContract.redeemFixedSetForUsdc(
          token.optimismAddress,
          amount,
          maxAmount
        )
        // if (tx) {
        //   const storedTx = getStoredTransaction(tx, chainId)
        //   addTransaction(storedTx)
        // }
        const receipt = await tx.wait()
        setIsTrading(false)
      }
    } catch (e) {
      setIsTrading(false)
      console.log('Error sending issuance transaction', e)
    }
  }, [address, amount, maxAmount, setIsTrading, signer, token])

  return {
    isTrading,
    handleTrade,
  }
}
