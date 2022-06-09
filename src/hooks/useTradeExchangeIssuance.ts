import { useCallback, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { useTransactions } from '@usedapp/core'

import { MAINNET } from 'constants/chains'
import { ETH, MATIC, Token } from 'constants/tokens'
import { useAccount } from 'hooks/useAccount'
import { useNetwork } from 'hooks/useNetwork'
import { fromWei } from 'utils'
import { ExchangeIssuanceQuote } from 'utils/exchangeIssuanceQuotes'
import { getIssuanceModule } from 'utils/issuanceModule'
import { getStoredTransaction } from 'utils/storedTransaction'
import { getAddressForToken } from 'utils/tokens'

import { useBalance } from './useBalance'
import {
  getExchangeIssuanceZeroExContract,
  useExchangeIssuanceZeroEx,
} from './useExchangeIssuanceZeroEx'

export const useTradeExchangeIssuance = (
  isIssuance: boolean,
  inputToken: Token,
  outputToken: Token,
  quoteData?: ExchangeIssuanceQuote | null
) => {
  const { account, provider } = useAccount()
  const { chainId } = useNetwork()
  const {
    issueExactSetFromETH,
    issueExactSetFromToken,
    redeemExactSetForETH,
    redeemExactSetForToken,
  } = useExchangeIssuanceZeroEx()
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

    try {
      setIsTransacting(true)

      const contract = await getExchangeIssuanceZeroExContract(
        provider?.getSigner(),
        chainId ?? MAINNET.chainId
      )

      if (isIssuance) {
        const isSellingNativeChainToken =
          inputToken.symbol === ETH.symbol || inputToken.symbol === MATIC.symbol

        if (isSellingNativeChainToken) {
          const issueTx = await issueExactSetFromETH(
            contract,
            outputTokenAddress,
            setTokenAmount,
            quoteData.tradeData,
            issuanceModule.address,
            issuanceModule.isDebtIssuance,
            quoteData.inputTokenAmount,
            quoteData.gas
          )
          if (issueTx) {
            const storedTx = getStoredTransaction(issueTx, chainId)
            addTransaction(storedTx)
          }
        } else {
          const maxAmountInputToken = quoteData.inputTokenAmount
          const issueTx = await issueExactSetFromToken(
            contract,
            outputTokenAddress,
            inputTokenAddress,
            setTokenAmount,
            maxAmountInputToken,
            quoteData.tradeData,
            issuanceModule.address,
            issuanceModule.isDebtIssuance,
            quoteData.gas
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

        if (isRedeemingNativeChainToken) {
          const redeemTx = await redeemExactSetForETH(
            contract,
            inputTokenAddress,
            setTokenAmount,
            minOutputReceive,
            quoteData.tradeData,
            issuanceModule.address,
            issuanceModule.isDebtIssuance,
            quoteData.gas
          )
          if (redeemTx) {
            const storedTx = getStoredTransaction(redeemTx, chainId)
            addTransaction(storedTx)
          }
        } else {
          const redeemTx = await redeemExactSetForToken(
            contract,
            inputTokenAddress,
            outputTokenAddress,
            setTokenAmount,
            minOutputReceive,
            quoteData.tradeData,
            issuanceModule.address,
            issuanceModule.isDebtIssuance,
            quoteData.gas
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
