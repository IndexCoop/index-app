import { useCallback, useState } from 'react'

import { Signer } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import {
  FlashMintZeroEx,
  getFlashMintZeroExContract,
  getIssuanceModule,
} from '@indexcoop/flash-mint-sdk'

import { ETH, MATIC } from 'constants/tokens'
import { ExchangeIssuanceZeroExQuote } from 'hooks/useBestQuote'
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
  FlashMintZeroExGasEstimateFailedError,
  getFlashMintZeroExGasEstimate,
} from 'utils/flashMint/flashMintZeroExGasEstimate'
import { getAddressForToken } from 'utils/tokens'

export const useTradeFlashMintZeroEx = () => {
  const { address, provider, signer } = useWallet()
  const { chainId } = useNetwork()
  const { getTokenBalance } = useBalanceData()

  const [isTransacting, setIsTransacting] = useState(false)
  const [txWouldFail, setTxWouldFail] = useState(false)

  const executeFlashMintZeroExTrade = useCallback(
    async (
      quote: ExchangeIssuanceZeroExQuote | null,
      slippage: number,
      override: boolean = false
    ) => {
      if (!address || !chainId || !quote) return

      const isMinting = quote.isMinting
      const inputToken = quote.inputToken
      const outputToken = quote.outputToken
      const indexTokenAmount = quote.indexTokenAmount
      const inputOutputTokenAmount = quote.inputOutputTokenAmount
      const gasLimit = quote.gas
      const componentQuotes = quote.componentQuotes

      const outputTokenAddress = getAddressForToken(outputToken, chainId)
      const inputTokenAddress = getAddressForToken(inputToken, chainId)
      if (!outputTokenAddress || !inputTokenAddress) return

      const setTokenSymbol = isMinting ? outputToken.symbol : inputToken.symbol
      const issuanceModule = getIssuanceModule(setTokenSymbol, chainId)

      const spendingTokenBalance =
        getTokenBalance(inputToken.symbol, chainId) || BigNumber.from(0)
      const requiredBalance = fromWei(
        quote.inputOutputTokenAmount,
        inputToken.decimals
      )
      if (spendingTokenBalance.lt(requiredBalance)) return

      const contract = getFlashMintZeroExContract(signer as Signer, chainId)
      const flashMint = new FlashMintZeroEx(contract)

      try {
        setIsTransacting(true)

        // Will throw error if tx would fail
        // If the user overrides, we take any gas estimate
        const canFail = override
        const gasEstimate = await getFlashMintZeroExGasEstimate(
          isMinting,
          inputToken,
          outputToken,
          indexTokenAmount,
          inputOutputTokenAmount,
          spendingTokenBalance,
          componentQuotes,
          provider,
          signer,
          chainId,
          canFail
        )
        console.log('gasEstimate for trade', gasEstimate.toString(), canFail)

        if (isMinting) {
          const isSellingNativeChainToken =
            inputToken.symbol === ETH.symbol ||
            inputToken.symbol === MATIC.symbol

          if (isSellingNativeChainToken) {
            captureTransaction({
              exchangeIssuance: CaptureExchangeIssuanceKey.zeroEx,
              function: CaptureExchangeIssuanceFunctionKey.issueEth,
              setToken: outputTokenAddress,
              setAmount: indexTokenAmount.toString(),
              gasLimit: gasLimit.toString(),
              slippage: slippage.toString(),
            })
            const mintTx = await flashMint.mintExactSetFromETH(
              outputTokenAddress,
              indexTokenAmount,
              componentQuotes,
              issuanceModule.address,
              issuanceModule.isDebtIssuance,
              inputOutputTokenAmount,
              { gasLimit }
            )
            logTx(chainId ?? -1, '0xEI', mintTx)
          } else {
            const maxAmountInputToken = inputOutputTokenAmount
            captureTransaction({
              exchangeIssuance: CaptureExchangeIssuanceKey.zeroEx,
              function: CaptureExchangeIssuanceFunctionKey.issueErc20,
              setToken: outputTokenAddress,
              setAmount: indexTokenAmount.toString(),
              gasLimit: gasLimit.toString(),
              slippage: slippage.toString(),
            })
            const mintTx = await flashMint.mintExactSetFromToken(
              outputTokenAddress,
              inputTokenAddress,
              indexTokenAmount,
              maxAmountInputToken,
              componentQuotes,
              issuanceModule.address,
              issuanceModule.isDebtIssuance,
              { gasLimit }
            )
            logTx(chainId ?? -1, '0xEI', mintTx)
          }
        } else {
          const isRedeemingNativeChainToken =
            outputToken.symbol === ETH.symbol ||
            outputToken.symbol === MATIC.symbol
          const minOutputReceive = inputOutputTokenAmount
          captureTransaction({
            exchangeIssuance: CaptureExchangeIssuanceKey.zeroEx,
            function: CaptureExchangeIssuanceFunctionKey.redeemEth,
            setToken: inputTokenAddress,
            setAmount: indexTokenAmount.toString(),
            gasLimit: gasLimit.toString(),
            slippage: slippage.toString(),
          })

          if (isRedeemingNativeChainToken) {
            const redeemTx = await flashMint.redeemExactSetForETH(
              inputTokenAddress,
              indexTokenAmount,
              minOutputReceive,
              componentQuotes,
              issuanceModule.address,
              issuanceModule.isDebtIssuance,
              { gasLimit }
            )
            logTx(chainId ?? -1, '0xEI', redeemTx)
          } else {
            captureTransaction({
              exchangeIssuance: CaptureExchangeIssuanceKey.zeroEx,
              function: CaptureExchangeIssuanceFunctionKey.redeemErc20,
              setToken: inputTokenAddress,
              setAmount: indexTokenAmount.toString(),
              gasLimit: gasLimit.toString(),
              slippage: slippage.toString(),
            })
            const redeemTx = await flashMint.redeemExactSetForToken(
              inputTokenAddress,
              outputTokenAddress,
              indexTokenAmount,
              minOutputReceive,
              componentQuotes,
              issuanceModule.address,
              issuanceModule.isDebtIssuance,
              { gasLimit }
            )
            logTx(chainId ?? -1, '0xEI', redeemTx)
          }
        }
        setIsTransacting(false)
      } catch (error) {
        console.log('Error sending FlashMintZeroEx tx', error)
        console.log('Override?', override)
        setIsTransacting(false)
        if (
          error instanceof FlashMintZeroExGasEstimateFailedError &&
          error.statusCode === 1001
        ) {
          setTxWouldFail(true)
        }
      }
    },
    [address, signer]
  )

  return { executeFlashMintZeroExTrade, isTransacting, txWouldFail }
}
