import { useCallback, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import {
  ExchangeIssuanceZeroEx,
  getExchangeIssuanceZeroExContract,
} from '@indexcoop/index-exchange-issuance-sdk'
import { useTransactions } from '@usedapp/core'

import { ETH, MATIC, Token } from 'constants/tokens'
import { useAccount } from 'hooks/useAccount'
import { useNetwork } from 'hooks/useNetwork'
import { fromWei } from 'utils'
import { ExchangeIssuanceQuote } from 'utils/exchangeIssuanceQuotes'
import { getIssuanceModule } from 'utils/issuanceModule'
import {
  CaptureExchangeIssuanceFunctionKey,
  CaptureExchangeIssuanceKey,
  captureTransaction,
} from 'utils/sentry'
import { getStoredTransaction } from 'utils/storedTransaction'
import { getAddressForToken } from 'utils/tokens'

import { useBalance } from './useBalance'

const gasLimit = BigNumber.from(2500000)

export const useTradeExchangeIssuance = (
  isIssuance: boolean,
  inputToken: Token,
  outputToken: Token,
  quoteData?: ExchangeIssuanceQuote | null
) => {
  const { account, provider } = useAccount()
  const { chainId } = useNetwork()
  const { getBalance } = useBalance()
  const { addTransaction } = useTransactions()

  const setTokenAmount = quoteData?.setTokenAmount
  const setTokenSymbol = isIssuance ? outputToken.symbol : inputToken.symbol
  const issuanceModule = getIssuanceModule(setTokenSymbol, chainId)
  const spendingTokenBalance =
    getBalance(inputToken.symbol) || BigNumber.from(0)

  const [isTransactingEI, setIsTransacting] = useState(false)

  const executeEITrade = useCallback(async () => {
    if (!account || !quoteData || !setTokenAmount) return

    const outputTokenAddress = getAddressForToken(outputToken, chainId)
    const inputTokenAddress = getAddressForToken(inputToken, chainId)
    if (!outputTokenAddress || !inputTokenAddress) return

    let requiredBalance = fromWei(
      quoteData.inputTokenAmount,
      inputToken.decimals
    )
    if (spendingTokenBalance.lt(requiredBalance)) return

    const contract = getExchangeIssuanceZeroExContract(
      provider?.getSigner(),
      chainId
    )
    const exchangeIssuance = new ExchangeIssuanceZeroEx(contract)

    try {
      setIsTransacting(true)

      if (isIssuance) {
        const isSellingNativeChainToken =
          inputToken.symbol === ETH.symbol || inputToken.symbol === MATIC.symbol

        if (isSellingNativeChainToken) {
          captureTransaction({
            exchangeIssuance: CaptureExchangeIssuanceKey.zeroEx,
            function: CaptureExchangeIssuanceFunctionKey.issueEth,
            setToken: outputTokenAddress,
            setAmount: setTokenAmount.toString(),
            gasLimit: quoteData.gas.toString(),
          })
          const issueTx = await exchangeIssuance.issueExactSetFromETH(
            outputTokenAddress,
            setTokenAmount,
            quoteData.tradeData,
            issuanceModule.address,
            issuanceModule.isDebtIssuance,
            quoteData.inputTokenAmount,
            { gasLimit }
          )
          if (issueTx) {
            const storedTx = getStoredTransaction(issueTx, chainId)
            addTransaction(storedTx)
          }
        } else {
          const maxAmountInputToken = quoteData.inputTokenAmount
          captureTransaction({
            exchangeIssuance: CaptureExchangeIssuanceKey.zeroEx,
            function: CaptureExchangeIssuanceFunctionKey.issueErc20,
            setToken: outputTokenAddress,
            setAmount: setTokenAmount.toString(),
            gasLimit: quoteData.gas.toString(),
          })
          const issueTx = await exchangeIssuance.issueExactSetFromToken(
            outputTokenAddress,
            inputTokenAddress,
            setTokenAmount,
            maxAmountInputToken,
            quoteData.tradeData,
            issuanceModule.address,
            issuanceModule.isDebtIssuance,
            { gasLimit }
          )
          if (issueTx) {
            const storedTx = getStoredTransaction(issueTx, chainId)
            addTransaction(storedTx)
          }
        }
      } else {
        const isRedeemingNativeChainToken =
          outputToken.symbol === ETH.symbol ||
          outputToken.symbol === MATIC.symbol
        const minOutputReceive = quoteData.inputTokenAmount
        captureTransaction({
          exchangeIssuance: CaptureExchangeIssuanceKey.zeroEx,
          function: CaptureExchangeIssuanceFunctionKey.redeemEth,
          setToken: inputTokenAddress,
          setAmount: setTokenAmount.toString(),
          gasLimit: quoteData.gas.toString(),
        })

        if (isRedeemingNativeChainToken) {
          const redeemTx = await exchangeIssuance.redeemExactSetForETH(
            inputTokenAddress,
            setTokenAmount,
            minOutputReceive,
            quoteData.tradeData,
            issuanceModule.address,
            issuanceModule.isDebtIssuance,
            { gasLimit }
          )
          if (redeemTx) {
            const storedTx = getStoredTransaction(redeemTx, chainId)
            addTransaction(storedTx)
          }
        } else {
          captureTransaction({
            exchangeIssuance: CaptureExchangeIssuanceKey.zeroEx,
            function: CaptureExchangeIssuanceFunctionKey.redeemErc20,
            setToken: inputTokenAddress,
            setAmount: setTokenAmount.toString(),
            gasLimit: quoteData.gas.toString(),
          })
          const redeemTx = await exchangeIssuance.redeemExactSetForToken(
            inputTokenAddress,
            outputTokenAddress,
            setTokenAmount,
            minOutputReceive,
            quoteData.tradeData,
            issuanceModule.address,
            issuanceModule.isDebtIssuance,
            { gasLimit }
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
  }, [account, quoteData])

  return { executeEITrade, isTransactingEI }
}
