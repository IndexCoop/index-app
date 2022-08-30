import { useCallback, useState } from 'react'

import { Signer } from 'ethers'
import { useNetwork } from 'wagmi'

import { BigNumber } from '@ethersproject/bignumber'
import {
  FlashMintLeveraged,
  getFlashMintLeveragedContract,
} from '@indexcoop/flash-mint-sdk'

import { DefaultGasLimitExchangeIssuanceLeveraged } from 'constants/gas'
import { ETH, MATIC } from 'constants/tokens'
import { ExchangeIssuanceLeveragedQuote } from 'hooks/useBestQuote'
import { useWallet } from 'hooks/useWallet'
import { fromWei } from 'utils'
import { logTx } from 'utils/api/analytics'
import {
  CaptureExchangeIssuanceFunctionKey,
  CaptureExchangeIssuanceKey,
  captureTransaction,
} from 'utils/api/sentry'
import { getAddressForToken } from 'utils/tokens'

import { useBalances } from './useBalance'

const gasLimit = BigNumber.from(DefaultGasLimitExchangeIssuanceLeveraged)

export const useTradeLeveragedExchangeIssuance = () => {
  const { address, signer } = useWallet()
  const { chain } = useNetwork()
  const { getBalance } = useBalances()
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

      const contract = getFlashMintLeveragedContract(
        signer as Signer,
        chain?.id
      )
      const flashMint = new FlashMintLeveraged(contract)

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
            const mintTx = await flashMint.mintExactSetFromETH(
              outputTokenAddress,
              setTokenAmount,
              swapDataDebtCollateral,
              swapDataInputOutputToken,
              inputOutputTokenAmount,
              { gasLimit }
            )
            logTx('LevEI', mintTx)
            // if (mintTx) {
            //   const storedTx = getStoredTransaction(mintTx, chain?.id)
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
            const mintTx = await flashMint.mintExactSetFromERC20(
              outputTokenAddress,
              setTokenAmount,
              inputTokenAddress,
              inputOutputTokenAmount,
              swapDataDebtCollateral,
              swapDataInputOutputToken,
              { gasLimit }
            )
            logTx('LevEI', mintTx)
            // if (mintTx) {
            //   const storedTx = getStoredTransaction(mintTx, chain?.id)
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
            const redeemTx = await flashMint.redeemExactSetForETH(
              inputTokenAddress,
              setTokenAmount,
              inputOutputTokenAmount,
              swapDataDebtCollateral,
              swapDataInputOutputToken,
              { gasLimit }
            )
            logTx('LevEI', redeemTx)
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
            const redeemTx = await flashMint.redeemExactSetForERC20(
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
            logTx('LevEI', redeemTx)
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
    [address, signer]
  )

  return { executeLevEITrade, isTransactingLevEI }
}
