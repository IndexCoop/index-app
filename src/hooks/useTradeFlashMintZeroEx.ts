import { useCallback, useState } from 'react'

import { Signer } from 'ethers'
// import { useTransactions } from '@usedapp/core'
import { useNetwork } from 'wagmi'

import { BigNumber } from '@ethersproject/bignumber'
import {
  FlashMintZeroEx,
  getFlashMintZeroExContract,
  getIssuanceModule,
} from '@indexcoop/flash-mint-sdk'

import { ETH, MATIC } from 'constants/tokens'
import { ExchangeIssuanceZeroExQuote } from 'hooks/useBestQuote'
import { useWallet } from 'hooks/useWallet'
import { fromWei } from 'utils'
import { logTx } from 'utils/api/analytics'
import {
  CaptureExchangeIssuanceFunctionKey,
  CaptureExchangeIssuanceKey,
  captureTransaction,
} from 'utils/api/sentry'
import { getFlashMintZeroExGasEstimate } from 'utils/flashMintZeroExGasEstimate'
import { getAddressForToken } from 'utils/tokens'

import { useBalances } from './useBalance'

export const useTradeFlashMintZeroEx = () => {
  const { address, provider, signer } = useWallet()
  const { chain } = useNetwork()
  const { getBalance } = useBalances()
  const chainId = chain?.id

  const [isTransactingEI, setIsTransacting] = useState(false)

  const executeEITrade = useCallback(
    async (quote: ExchangeIssuanceZeroExQuote | null, slippage: number) => {
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
        getBalance(inputToken.symbol) || BigNumber.from(0)
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
          chainId
        )
        console.log('gasEstimate for trade', gasEstimate.toString())

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
            logTx('0xEI', mintTx)
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
            logTx('0xEI', mintTx)
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
            logTx('0xEI', redeemTx)
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
            logTx('0xEI', redeemTx)
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

  return { executeEITrade, isTransactingEI }
}
