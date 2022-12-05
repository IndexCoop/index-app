import { useCallback, useState } from 'react'

import { Signer } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import {
  FlashMintLeveraged,
  getFlashMintLeveragedContract,
} from '@indexcoop/flash-mint-sdk'

import { ETH, MATIC } from 'constants/tokens'
import { ExchangeIssuanceLeveragedQuote } from 'hooks/useBestQuote'
import { useNetwork } from 'hooks/useNetwork'
import { useWallet } from 'hooks/useWallet'
import { useBalanceData } from 'providers/Balances'
import { fromWei } from 'utils'
import { logTx } from 'utils/api/analytics'
import {
  CaptureExchangeIssuanceFunctionKey,
  CaptureExchangeIssuanceKey,
  captureTransaction,
} from 'utils/api/sentry'
import {
  FlashMintLeveragedGasEstimateFailedError,
  getFlashMintLeveragedGasEstimate,
} from 'utils/flashMintLeveragedGasEstimate'
import { getAddressForToken } from 'utils/tokens'

export const useTradeFlashMintLeveraged = () => {
  const { address, provider, signer } = useWallet()
  const { chainId } = useNetwork()
  const { getTokenBalance } = useBalanceData()

  const [isTransacting, setIsTransacting] = useState(false)
  const [txWouldFail, setTxWouldFail] = useState(false)

  const executeFlashMintLeveragedTrade = useCallback(
    async (
      quote: ExchangeIssuanceLeveragedQuote | null,
      slippage: number,
      override: boolean = false
    ) => {
      if (!address || !chainId || !quote) return

      const isMinting = quote.isMinting
      const inputToken = quote.inputToken
      const outputToken = quote.outputToken
      const indexTokenAmount = quote.indexTokenAmount
      const inputOutputTokenAmount = quote.inputOutputTokenAmount
      const swapDataDebtCollateral = quote.swapDataDebtCollateral
      const swapDataInputOutputToken = quote.swapDataPaymentToken

      const inputTokenAddress = getAddressForToken(inputToken, chainId)
      const outputTokenAddress = getAddressForToken(outputToken, chainId)
      if (!outputTokenAddress || !inputTokenAddress) return

      let requiredBalance = fromWei(inputOutputTokenAmount, inputToken.decimals)
      const spendingTokenBalance =
        getTokenBalance(inputToken.symbol, chainId) || BigNumber.from(0)
      if (spendingTokenBalance.lt(requiredBalance)) return

      const contract = getFlashMintLeveragedContract(signer as Signer, chainId)
      const flashMint = new FlashMintLeveraged(contract)

      try {
        setIsTransacting(true)

        // Will throw error if tx would fail
        // If the user overrides, we take any gas estimate
        const canFail = override
        const gasLimit = await getFlashMintLeveragedGasEstimate(
          isMinting,
          inputToken,
          outputToken,
          indexTokenAmount,
          quote.inputOutputTokenAmount,
          spendingTokenBalance,
          quote.swapDataDebtCollateral,
          quote.swapDataPaymentToken,
          provider,
          signer,
          chainId,
          canFail
        )

        if (isMinting) {
          const isSellingNativeChainToken =
            inputToken.symbol === ETH.symbol ||
            inputToken.symbol === MATIC.symbol

          if (isSellingNativeChainToken) {
            captureTransaction({
              exchangeIssuance: CaptureExchangeIssuanceKey.leveraged,
              function: CaptureExchangeIssuanceFunctionKey.issueEth,
              setToken: outputTokenAddress,
              setAmount: indexTokenAmount.toString(),
              gasLimit: gasLimit.toString(),
              slippage: slippage.toString(),
            })
            const mintTx = await flashMint.mintExactSetFromETH(
              outputTokenAddress,
              indexTokenAmount,
              swapDataDebtCollateral,
              swapDataInputOutputToken,
              inputOutputTokenAmount,
              { gasLimit }
            )
            logTx(chainId ?? -1, 'LevEI', mintTx)
          } else {
            captureTransaction({
              exchangeIssuance: CaptureExchangeIssuanceKey.leveraged,
              function: CaptureExchangeIssuanceFunctionKey.issueErc20,
              setToken: outputTokenAddress,
              setAmount: indexTokenAmount.toString(),
              gasLimit: gasLimit.toString(),
              slippage: slippage.toString(),
            })
            const mintTx = await flashMint.mintExactSetFromERC20(
              outputTokenAddress,
              indexTokenAmount,
              inputTokenAddress,
              inputOutputTokenAmount,
              swapDataDebtCollateral,
              swapDataInputOutputToken,
              { gasLimit }
            )
            logTx(chainId ?? -1, 'LevEI', mintTx)
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
              setAmount: indexTokenAmount.toString(),
              gasLimit: gasLimit.toString(),
              slippage: slippage.toString(),
            })
            const redeemTx = await flashMint.redeemExactSetForETH(
              inputTokenAddress,
              indexTokenAmount,
              inputOutputTokenAmount,
              swapDataDebtCollateral,
              swapDataInputOutputToken,
              { gasLimit }
            )
            logTx(chainId ?? -1, 'LevEI', redeemTx)
          } else {
            captureTransaction({
              exchangeIssuance: CaptureExchangeIssuanceKey.leveraged,
              function: CaptureExchangeIssuanceFunctionKey.redeemErc20,
              setToken: inputTokenAddress,
              setAmount: indexTokenAmount.toString(),
              gasLimit: gasLimit.toString(),
              slippage: slippage.toString(),
            })
            const redeemTx = await flashMint.redeemExactSetForERC20(
              inputTokenAddress,
              indexTokenAmount,
              outputTokenAddress,
              inputOutputTokenAmount,
              swapDataDebtCollateral,
              swapDataInputOutputToken,
              {
                gasLimit,
              }
            )
            logTx(chainId ?? -1, 'LevEI', redeemTx)
          }
        }
        setIsTransacting(false)
      } catch (error) {
        console.log('Error sending FlashMintLeveraged tx', error)
        console.log('Override?', override)
        setIsTransacting(false)
        if (
          error instanceof FlashMintLeveragedGasEstimateFailedError &&
          error.statusCode === 1000
        ) {
          setTxWouldFail(true)
        }
      }
    },
    [address, signer]
  )

  return { executeFlashMintLeveragedTrade, isTransacting, txWouldFail }
}
