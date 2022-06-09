import { useCallback, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { useTransactions } from '@usedapp/core'

import { ETH, MATIC, Token } from 'constants/tokens'
import { useAccount } from 'hooks/useAccount'
import { useNetwork } from 'hooks/useNetwork'
import { fromWei } from 'utils'
import { SwapData } from 'utils/exchangeIssuanceQuotes'
import { getStoredTransaction } from 'utils/storedTransaction'
import { getAddressForToken } from 'utils/tokens'

import { useBalance } from './useBalance'
import {
  getExchangeIssuanceLeveragedContract,
  useExchangeIssuanceLeveraged,
} from './useExchangeIssuanceLeveraged'

export const useTradeLeveragedExchangeIssuance = (
  isIssuance: boolean,
  inputToken: Token,
  outputToken: Token,
  // buy / sell token amount
  tokenAmout: BigNumber,
  // max input / min output
  inputOutputLimit: BigNumber,
  debtCollateralSwapData?: SwapData,
  inputOutputSwapData?: SwapData
) => {
  const { account, provider } = useAccount()
  const { chainId } = useNetwork()
  const {
    issueExactSetFromETH,
    issueExactSetFromERC20,
    redeemExactSetForETH,
    redeemExactSetForERC20,
  } = useExchangeIssuanceLeveraged()
  const { getBalance } = useBalance()
  const { addTransaction } = useTransactions()

  const spendingTokenBalance =
    getBalance(inputToken.symbol) || BigNumber.from(0)

  const [isTransactingLevEI, setIsTransacting] = useState(false)

  const executeLevEITrade = useCallback(async () => {
    if (
      !account ||
      inputOutputLimit.isZero() ||
      tokenAmout.isZero() ||
      debtCollateralSwapData === undefined ||
      inputOutputSwapData === undefined
    )
      return

    const outputTokenAddress = getAddressForToken(outputToken, chainId)
    const inputTokenAddress = getAddressForToken(inputToken, chainId)
    if (!outputTokenAddress || !inputTokenAddress) return

    let requiredBalance = fromWei(inputOutputLimit, inputToken.decimals)
    if (spendingTokenBalance.lt(requiredBalance)) return

    try {
      setIsTransacting(true)
      if (isIssuance) {
        const amountOfSetToken = tokenAmout
        const isSellingNativeChainToken =
          inputToken.symbol === ETH.symbol || inputToken.symbol === MATIC.symbol

        if (isSellingNativeChainToken) {
          const issueTx = await issueExactSetFromETH(
            provider,
            chainId,
            outputTokenAddress,
            amountOfSetToken,
            debtCollateralSwapData,
            inputOutputSwapData,
            inputOutputLimit
          )
          if (issueTx) {
            const storedTx = getStoredTransaction(issueTx, chainId)
            addTransaction(storedTx)
          }
        } else {
          const issueTx = await issueExactSetFromERC20(
            provider,
            chainId,
            outputTokenAddress,
            amountOfSetToken,
            inputTokenAddress,
            inputOutputLimit,
            debtCollateralSwapData,
            inputOutputSwapData
          )
          if (issueTx) {
            const storedTx = getStoredTransaction(issueTx, chainId)
            addTransaction(storedTx)
          }
        }
      } else {
        const isRedeemingToNativeChainToken =
          outputToken.symbol === ETH.symbol ||
          outputToken.symbol === MATIC.symbol

        const contract = await getExchangeIssuanceLeveragedContract(
          provider?.getSigner(),
          chainId
        )

        if (isRedeemingToNativeChainToken) {
          const redeemTx = await redeemExactSetForETH(
            contract,
            inputTokenAddress,
            tokenAmout,
            inputOutputLimit,
            debtCollateralSwapData,
            inputOutputSwapData
          )
          if (redeemTx) {
            const storedTx = getStoredTransaction(redeemTx, chainId)
            addTransaction(storedTx)
          }
        } else {
          const redeemTx = await redeemExactSetForERC20(
            contract,
            inputTokenAddress,
            tokenAmout,
            outputTokenAddress,
            inputOutputLimit,
            debtCollateralSwapData,
            inputOutputSwapData
          )
          if (redeemTx) {
            const storedTx = getStoredTransaction(redeemTx, chainId)
            addTransaction(storedTx)
          }
        }
      }
      setIsTransacting(false)
    } catch (error) {
      setIsTransacting(false)
      console.log('Error sending transaction', error)
    }
  }, [account, inputOutputLimit])

  return { executeLevEITrade, isTransactingLevEI }
}
