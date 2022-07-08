import { useCallback, useState } from 'react'

import { Signer } from 'ethers'
import { useNetwork, useSigner } from 'wagmi'

import { BigNumber } from '@ethersproject/bignumber'
import {
  ExchangeIssuanceLeveraged,
  getExchangeIssuanceLeveragedContract,
} from '@indexcoop/index-exchange-issuance-sdk'

import { DefaultGasLimitExchangeIssuanceLeveraged } from 'constants/gas'
import { ETH, MATIC } from 'constants/tokens'
import { ExchangeIssuanceLeveragedQuote } from 'hooks/useBestTradeOption'
import { useWallet } from 'hooks/useWallet'
import { fromWei } from 'utils'
import {
  CaptureExchangeIssuanceFunctionKey,
  CaptureExchangeIssuanceKey,
  captureTransaction,
} from 'utils/sentry'
import { getAddressForToken } from 'utils/tokens'

import { useBalances } from './useBalance'

const gasLimit = BigNumber.from(DefaultGasLimitExchangeIssuanceLeveraged)

export const useTradeLeveragedExchangeIssuance = () => {
  const { address } = useWallet()
  const { chain } = useNetwork()
  const { getBalance } = useBalances()
  const { data: signer } = useSigner()
  const chainId = chain?.id

  const [isTransactingLevEI, setIsTransacting] = useState(false)

  const executeLevEITrade = useCallback(
    async (quote: ExchangeIssuanceLeveragedQuote | null, slippage: number) => {
      if (!address || !quote) return

      const isIssuance = quote.isIssuance
      const inputToken = quote.inputToken
      const outputToken = quote.outputToken
      const setTokenAmount = quote.setTokenAmount
      const inputOutputTokenAmount = quote.inputOutputTokenAmount
      const swapDataDebtCollateral = quote.swapDataDebtCollateral
      const swapDataInputOutputToken = quote.swapDataPaymentToken

      const inputTokenAddress = getAddressForToken(inputToken, chainId)
      const outputTokenAddress = getAddressForToken(outputToken, chainId)
      if (!outputTokenAddress || !inputTokenAddress) return

      let requiredBalance = fromWei(inputOutputTokenAmount, inputToken.decimals)
      const spendingTokenBalance =
        getBalance(inputToken.symbol) || BigNumber.from(0)
      if (spendingTokenBalance.lt(requiredBalance)) return

      const contract = getExchangeIssuanceLeveragedContract(
        signer as Signer,
        chain?.id
      )
      const exchangeIssuance = new ExchangeIssuanceLeveraged(contract)

      try {
        setIsTransacting(true)
        if (isIssuance) {
          const isSellingNativeChainToken =
            inputToken.symbol === ETH.symbol ||
            inputToken.symbol === MATIC.symbol

          if (isSellingNativeChainToken) {
            captureTransaction({
              exchangeIssuance: CaptureExchangeIssuanceKey.leveraged,
              function: CaptureExchangeIssuanceFunctionKey.issueEth,
              setToken: outputTokenAddress,
              setAmount: setTokenAmount.toString(),
              gasLimit: gasLimit.toString(),
              slippage: slippage.toString(),
            })
            const issueTx = await exchangeIssuance.issueExactSetFromETH(
              outputTokenAddress,
              setTokenAmount,
              swapDataDebtCollateral,
              swapDataInputOutputToken,
              inputOutputTokenAmount,
              { gasLimit }
            )
            // if (issueTx) {
            //   const storedTx = getStoredTransaction(issueTx, chain?.id)
            //   addTransaction(storedTx)
            // }
          } else {
            captureTransaction({
              exchangeIssuance: CaptureExchangeIssuanceKey.leveraged,
              function: CaptureExchangeIssuanceFunctionKey.issueErc20,
              setToken: outputTokenAddress,
              setAmount: setTokenAmount.toString(),
              gasLimit: gasLimit.toString(),
              slippage: slippage.toString(),
            })
            const issueTx = await exchangeIssuance.issueExactSetFromERC20(
              outputTokenAddress,
              setTokenAmount,
              inputTokenAddress,
              inputOutputTokenAmount,
              swapDataDebtCollateral,
              swapDataInputOutputToken,
              { gasLimit }
            )
            // if (issueTx) {
            //   const storedTx = getStoredTransaction(issueTx, chain?.id)
            //   addTransaction(storedTx)
            // }
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
              setAmount: setTokenAmount.toString(),
              gasLimit: gasLimit.toString(),
              slippage: slippage.toString(),
            })
            const redeemTx = await exchangeIssuance.redeemExactSetForETH(
              inputTokenAddress,
              setTokenAmount,
              inputOutputTokenAmount,
              swapDataDebtCollateral,
              swapDataInputOutputToken,
              { gasLimit }
            )
            // if (redeemTx) {
            //   const storedTx = getStoredTransaction(redeemTx, chain?.id)
            //   addTransaction(storedTx)
            // }
          } else {
            captureTransaction({
              exchangeIssuance: CaptureExchangeIssuanceKey.leveraged,
              function: CaptureExchangeIssuanceFunctionKey.redeemErc20,
              setToken: inputTokenAddress,
              setAmount: setTokenAmount.toString(),
              gasLimit: gasLimit.toString(),
              slippage: slippage.toString(),
            })
            const redeemTx = await exchangeIssuance.redeemExactSetForERC20(
              inputTokenAddress,
              setTokenAmount,
              outputTokenAddress,
              inputOutputTokenAmount,
              swapDataDebtCollateral,
              swapDataInputOutputToken,
              {
                gasLimit,
                maxFeePerGas: BigNumber.from(100000000000),
                maxPriorityFeePerGas: BigNumber.from(2000000000),
              }
            )
            // if (redeemTx) {
            //   const storedTx = getStoredTransaction(redeemTx, chain?.id)
            //   addTransaction(storedTx)
            // }
          }
        }
        setIsTransacting(false)
      } catch (error) {
        setIsTransacting(false)
        console.log('Error sending transaction', error)
      }
    },
    [address]
  )

  return { executeLevEITrade, isTransactingLevEI }
}
