import { useCallback, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import {
  ExchangeIssuanceLeveraged,
  getExchangeIssuanceLeveragedContract,
  SwapData,
} from '@indexcoop/index-exchange-issuance-sdk'
import { useTransactions } from '@usedapp/core'

import { ETH, MATIC, Token } from 'constants/tokens'
import { useNetwork } from 'hooks/useNetwork'
import { useWallet } from 'hooks/useWallet'
import { fromWei } from 'utils'
import {
  CaptureExchangeIssuanceFunctionKey,
  CaptureExchangeIssuanceKey,
  captureTransaction,
} from 'utils/sentry'
import { getStoredTransaction } from 'utils/storedTransaction'
import { getAddressForToken } from 'utils/tokens'

import { useBalance } from './useBalance'

export const useTradeLeveragedExchangeIssuance = (
  isIssuance: boolean,
  inputToken: Token,
  outputToken: Token,
  // buy / sell token amount
  tokenAmout: BigNumber,
  // max input / min output
  inputOutputLimit: BigNumber,
  slippage: number,
  debtCollateralSwapData?: SwapData,
  inputOutputSwapData?: SwapData
) => {
  const { address, provider } = useWallet()
  const { chainId } = useNetwork()
  const { getBalance } = useBalance()
  const { addTransaction } = useTransactions()

  const [isTransactingLevEI, setIsTransacting] = useState(false)

  const spendingTokenBalance =
    getBalance(inputToken.symbol) || BigNumber.from(0)

  const executeLevEITrade = useCallback(async () => {
    if (
      !address ||
      inputOutputLimit.isZero() ||
      tokenAmout.isZero() ||
      debtCollateralSwapData === undefined ||
      inputOutputSwapData === undefined
    )
      return

    const inputTokenAddress = getAddressForToken(inputToken, chainId)
    const outputTokenAddress = getAddressForToken(outputToken, chainId)
    if (!outputTokenAddress || !inputTokenAddress) return

    let requiredBalance = fromWei(inputOutputLimit, inputToken.decimals)
    if (spendingTokenBalance.lt(requiredBalance)) return

    const contract = getExchangeIssuanceLeveragedContract(
      provider?.getSigner(),
      chainId
    )
    const exchangeIssuance = new ExchangeIssuanceLeveraged(contract)

    try {
      setIsTransacting(true)
      if (isIssuance) {
        const amountOfSetToken = tokenAmout
        const isSellingNativeChainToken =
          inputToken.symbol === ETH.symbol || inputToken.symbol === MATIC.symbol

        if (isSellingNativeChainToken) {
          captureTransaction({
            exchangeIssuance: CaptureExchangeIssuanceKey.leveraged,
            function: CaptureExchangeIssuanceFunctionKey.issueEth,
            setToken: outputTokenAddress,
            setAmount: amountOfSetToken.toString(),
            gasLimit: BigNumber.from(1800000).toString(),
            slippage: slippage.toString(),
          })
          const issueTx = await exchangeIssuance.issueExactSetFromETH(
            outputTokenAddress,
            amountOfSetToken,
            debtCollateralSwapData,
            inputOutputSwapData,
            inputOutputLimit,
            { gasLimit: BigNumber.from(1800000) }
          )
          if (issueTx) {
            const storedTx = getStoredTransaction(issueTx, chainId)
            addTransaction(storedTx)
          }
        } else {
          captureTransaction({
            exchangeIssuance: CaptureExchangeIssuanceKey.leveraged,
            function: CaptureExchangeIssuanceFunctionKey.issueErc20,
            setToken: outputTokenAddress,
            setAmount: amountOfSetToken.toString(),
            gasLimit: BigNumber.from(1800000).toString(),
            slippage: slippage.toString(),
          })
          const issueTx = await exchangeIssuance.issueExactSetFromERC20(
            outputTokenAddress,
            amountOfSetToken,
            inputTokenAddress,
            inputOutputLimit,
            debtCollateralSwapData,
            inputOutputSwapData,
            { gasLimit: BigNumber.from(1800000) }
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

        if (isRedeemingToNativeChainToken) {
          captureTransaction({
            exchangeIssuance: CaptureExchangeIssuanceKey.leveraged,
            function: CaptureExchangeIssuanceFunctionKey.redeemEth,
            setToken: inputTokenAddress,
            setAmount: tokenAmout.toString(),
            gasLimit: BigNumber.from(1800000).toString(),
            slippage: slippage.toString(),
          })
          const redeemTx = await exchangeIssuance.redeemExactSetForETH(
            inputTokenAddress,
            tokenAmout,
            inputOutputLimit,
            debtCollateralSwapData,
            inputOutputSwapData,
            { gasLimit: BigNumber.from(1800000) }
          )
          if (redeemTx) {
            const storedTx = getStoredTransaction(redeemTx, chainId)
            addTransaction(storedTx)
          }
        } else {
          captureTransaction({
            exchangeIssuance: CaptureExchangeIssuanceKey.leveraged,
            function: CaptureExchangeIssuanceFunctionKey.redeemErc20,
            setToken: inputTokenAddress,
            setAmount: tokenAmout.toString(),
            gasLimit: BigNumber.from(1800000).toString(),
            slippage: slippage.toString(),
          })
          const redeemTx = await exchangeIssuance.redeemExactSetForERC20(
            inputTokenAddress,
            tokenAmout,
            outputTokenAddress,
            inputOutputLimit,
            debtCollateralSwapData,
            inputOutputSwapData,
            {
              gasLimit: BigNumber.from(2000000),
              maxFeePerGas: BigNumber.from(100000000000),
              maxPriorityFeePerGas: BigNumber.from(2000000000),
            }
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
  }, [address, inputOutputLimit])

  return { executeLevEITrade, isTransactingLevEI }
}
