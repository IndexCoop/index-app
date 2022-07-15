import { useCallback, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import {
  ExchangeIssuanceLeveraged,
  getExchangeIssuanceLeveragedContract,
  SwapData,
} from '@indexcoop/index-exchange-issuance-sdk'
import { useTransactions } from '@usedapp/core'

import { DefaultGasLimitExchangeIssuanceLeveraged } from 'constants/gas'
import { ETH, MATIC, Token } from 'constants/tokens'
import { useAccount } from 'hooks/useAccount'
import { useNetwork } from 'hooks/useNetwork'
import { fromWei } from 'utils'
import {
  CaptureExchangeIssuanceFunctionKey,
  CaptureExchangeIssuanceKey,
  captureTransaction,
} from 'utils/sentry'
import { getStoredTransaction } from 'utils/storedTransaction'
import { getAddressForToken } from 'utils/tokens'

import { useBalance } from './useBalance'

const gasLimit = BigNumber.from(DefaultGasLimitExchangeIssuanceLeveraged)

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
  const { account, provider } = useAccount()
  const { chainId } = useNetwork()
  const { getBalance } = useBalance()
  const { addTransaction } = useTransactions()

  const [isTransactingLevEI, setIsTransacting] = useState(false)

  const spendingTokenBalance =
    getBalance(inputToken.symbol) || BigNumber.from(0)

  const executeLevEITrade = useCallback(async () => {
    if (
      !account ||
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
            gasLimit: gasLimit.toString(),
            slippage: slippage.toString(),
          })
          const issueTx = await exchangeIssuance.issueExactSetFromETH(
            outputTokenAddress,
            amountOfSetToken,
            debtCollateralSwapData,
            inputOutputSwapData,
            inputOutputLimit,
            { gasLimit }
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
            gasLimit: gasLimit.toString(),
            slippage: slippage.toString(),
          })
          const issueTx = await exchangeIssuance.issueExactSetFromERC20(
            outputTokenAddress,
            amountOfSetToken,
            inputTokenAddress,
            inputOutputLimit,
            debtCollateralSwapData,
            inputOutputSwapData,
            { gasLimit }
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
            gasLimit: gasLimit.toString(),
            slippage: slippage.toString(),
          })
          const redeemTx = await exchangeIssuance.redeemExactSetForETH(
            inputTokenAddress,
            tokenAmout,
            inputOutputLimit,
            debtCollateralSwapData,
            inputOutputSwapData,
            { gasLimit }
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
            gasLimit: gasLimit.toString(),
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
              gasLimit,
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
  }, [account, inputOutputLimit])

  return { executeLevEITrade, isTransactingLevEI }
}
