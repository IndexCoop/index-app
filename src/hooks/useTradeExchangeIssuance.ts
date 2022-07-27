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
import {
  CaptureExchangeIssuanceFunctionKey,
  CaptureExchangeIssuanceKey,
  captureTransaction,
} from 'utils/sentry'
// TODO:
// import { getStoredTransaction } from 'utils/storedTransaction'
import { getAddressForToken } from 'utils/tokens'

import { useBalances } from './useBalance'

export const useTradeExchangeIssuance = () => {
  const { address, signer } = useWallet()
  const { chain } = useNetwork()
  const { getBalance } = useBalances()
  // const { addTransaction } = useTransactions()
  const chainId = chain?.id

  const [isTransactingEI, setIsTransacting] = useState(false)

  const executeEITrade = useCallback(
    async (quote: ExchangeIssuanceZeroExQuote | null, slippage: number) => {
      if (!address || !quote) return

      const isIssuance = quote.isIssuance
      const inputToken = quote.inputToken
      const outputToken = quote.outputToken
      const setTokenAmount = quote.setTokenAmount
      const inputOutputTokenAmount = quote.inputOutputTokenAmount
      const gasLimit = quote.gas
      const componentQuotes = quote.componentQuotes

      const outputTokenAddress = getAddressForToken(outputToken, chainId)
      const inputTokenAddress = getAddressForToken(inputToken, chainId)
      if (!outputTokenAddress || !inputTokenAddress) return

      const setTokenSymbol = isIssuance ? outputToken.symbol : inputToken.symbol
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

        if (isIssuance) {
          const isSellingNativeChainToken =
            inputToken.symbol === ETH.symbol ||
            inputToken.symbol === MATIC.symbol

          if (isSellingNativeChainToken) {
            captureTransaction({
              exchangeIssuance: CaptureExchangeIssuanceKey.zeroEx,
              function: CaptureExchangeIssuanceFunctionKey.issueEth,
              setToken: outputTokenAddress,
              setAmount: setTokenAmount.toString(),
              gasLimit: gasLimit.toString(),
              slippage: slippage.toString(),
            })
            const mintTx = await flashMint.mintExactSetFromETH(
              outputTokenAddress,
              setTokenAmount,
              componentQuotes,
              issuanceModule.address,
              issuanceModule.isDebtIssuance,
              inputOutputTokenAmount,
              { gasLimit }
            )
            // if (mintTx) {
            //   const storedTx = getStoredTransaction(mintTx, chainId)
            //   addTransaction(storedTx)
            // }
          } else {
            const maxAmountInputToken = inputOutputTokenAmount
            captureTransaction({
              exchangeIssuance: CaptureExchangeIssuanceKey.zeroEx,
              function: CaptureExchangeIssuanceFunctionKey.issueErc20,
              setToken: outputTokenAddress,
              setAmount: setTokenAmount.toString(),
              gasLimit: gasLimit.toString(),
              slippage: slippage.toString(),
            })
            const mintTx = await flashMint.mintExactSetFromToken(
              outputTokenAddress,
              inputTokenAddress,
              setTokenAmount,
              maxAmountInputToken,
              componentQuotes,
              issuanceModule.address,
              issuanceModule.isDebtIssuance,
              { gasLimit }
            )
            // if (mintTx) {
            //   const storedTx = getStoredTransaction(mintTx, chainId)
            //   addTransaction(storedTx)
            // }
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
            setAmount: setTokenAmount.toString(),
            gasLimit: gasLimit.toString(),
            slippage: slippage.toString(),
          })

          if (isRedeemingNativeChainToken) {
            const redeemTx = await flashMint.redeemExactSetForETH(
              inputTokenAddress,
              setTokenAmount,
              minOutputReceive,
              componentQuotes,
              issuanceModule.address,
              issuanceModule.isDebtIssuance,
              { gasLimit }
            )
            // if (redeemTx) {
            //   const storedTx = getStoredTransaction(redeemTx, chainId)
            //   addTransaction(storedTx)
            // }
          } else {
            captureTransaction({
              exchangeIssuance: CaptureExchangeIssuanceKey.zeroEx,
              function: CaptureExchangeIssuanceFunctionKey.redeemErc20,
              setToken: inputTokenAddress,
              setAmount: setTokenAmount.toString(),
              gasLimit: gasLimit.toString(),
              slippage: slippage.toString(),
            })
            const redeemTx = await flashMint.redeemExactSetForToken(
              inputTokenAddress,
              outputTokenAddress,
              setTokenAmount,
              minOutputReceive,
              componentQuotes,
              issuanceModule.address,
              issuanceModule.isDebtIssuance,
              { gasLimit }
            )
            // if (redeemTx) {
            //   const storedTx = getStoredTransaction(redeemTx, chainId)
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

  return { executeEITrade, isTransactingEI }
}
