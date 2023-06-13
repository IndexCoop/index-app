import { useCallback, useState } from 'react'

import { utils } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'

import { FlashMintPerp } from '@/constants/contractAddresses'
import { Token } from '@/constants/tokens'
import { useNetwork } from '@/lib/hooks/useNetwork'
import { useWallet } from '@/lib/hooks/useWallet'
import { ISSUANCE_ABI } from '@/lib/utils/abi/Issuance'
import { logTx } from '@/lib/utils/api/analytics'
import {
  CaptureExchangeIssuanceFunctionKey,
  CaptureExchangeIssuanceKey,
  captureTransaction,
} from '@/lib/utils/api/sentry'

const ISSUANCEInterface = new utils.Interface(ISSUANCE_ABI)

const gasLimitMint = BigNumber.from('1600000')
const gasLimitRedeem = BigNumber.from('2200000')

/**
 * Approve the spending of an ERC20
 */
export const useIssuance = () => {
  const { chainId } = useNetwork()
  const { address, signer } = useWallet()

  const [isTrading, setIsTrading] = useState(false)

  const handleTrade = useCallback(
    async (
      isIssue: boolean,
      slippage: number,
      token?: Token,
      amount?: BigNumber,
      maxAmount?: BigNumber
    ) => {
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
            maxAmount,
            { gasLimit: gasLimitMint }
          )
          // if (tx) {
          //   const storedTx = getStoredTransaction(tx, chainId)
          //   addTransaction(storedTx)
          // }
          await tx.wait()
          logTx(chainId ?? -1, 'Perp', tx)
          captureTransaction({
            exchangeIssuance: CaptureExchangeIssuanceKey.perp,
            function: CaptureExchangeIssuanceFunctionKey.issueErc20,
            setToken: token?.optimismAddress ?? 'n/a',
            setAmount: amount?.toString() ?? 'n/a',
            gasLimit: gasLimitMint.toString(),
            slippage: slippage.toString(),
          })
          setIsTrading(false)
        } else {
          const tx = await tokenContract.redeemFixedSetForUsdc(
            token.optimismAddress,
            amount,
            maxAmount,
            { gasLimit: gasLimitRedeem }
          )
          // if (tx) {
          //   const storedTx = getStoredTransaction(tx, chainId)
          //   addTransaction(storedTx)
          // }
          await tx.wait()
          logTx(chainId ?? -1, 'Perp', tx)
          captureTransaction({
            exchangeIssuance: CaptureExchangeIssuanceKey.perp,
            function: CaptureExchangeIssuanceFunctionKey.redeemErc20,
            setToken: token?.optimismAddress ?? 'n/a',
            setAmount: amount?.toString() ?? 'n/a',
            gasLimit: gasLimitMint.toString(),
            slippage: slippage.toString(),
          })
          setIsTrading(false)
        }
      } catch (e) {
        setIsTrading(false)
        console.log('Error sending issuance transaction', e)
      }
    },
    [address, chainId, setIsTrading, signer]
  )

  return {
    isTrading,
    handleTrade,
  }
}
