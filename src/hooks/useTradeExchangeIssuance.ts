import { useCallback, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, useEthers } from '@usedapp/core'

import { ETH, MATIC, Token } from 'constants/tokens'
import { fromWei } from 'utils'
import { ExchangeIssuanceQuote } from 'utils/exchangeIssuanceQuotes'
import { getIssuanceModule } from 'utils/issuanceModule'

import { useExchangeIssuanceZeroEx } from './useExchangeIssuanceZeroEx'
import { useTokenBalance } from './useTokenBalance'

export const useTradeExchangeIssuance = (
  isIssuance: boolean,
  inputToken: Token,
  outputToken: Token,
  // buy token amount
  tokenAmout: BigNumber,
  quoteData?: ExchangeIssuanceQuote | null
) => {
  const { account, chainId, library } = useEthers()
  const {
    issueExactSetFromETH,
    issueExactSetFromToken,
    redeemExactSetForETH,
    redeemExactSetForToken,
  } = useExchangeIssuanceZeroEx()
  const { getBalance } = useTokenBalance()

  const tokenSymbol = isIssuance ? outputToken.symbol : inputToken.symbol
  const issuanceModule = getIssuanceModule(tokenSymbol, chainId)
  const spendingTokenBalance = getBalance(inputToken) || BigNumber.from(0)

  const [isTransactingEI, setIsTransacting] = useState(false)

  const executeEITrade = useCallback(async () => {
    if (!account || !quoteData) return

    const outputTokenAddress =
      chainId === ChainId.Polygon
        ? outputToken.polygonAddress
        : outputToken.address
    const inputTokenAddress =
      chainId === ChainId.Polygon
        ? inputToken.polygonAddress
        : inputToken.address
    if (!outputTokenAddress || !inputTokenAddress) return

    let requiredBalance = fromWei(
      quoteData.inputTokenAmount,
      inputToken.decimals
    )
    if (spendingTokenBalance.lt(requiredBalance)) return

    try {
      setIsTransacting(true)
      if (isIssuance) {
        const amountOfSetToken = tokenAmout
        const isSellingNativeChainToken =
          inputToken.symbol === ETH.symbol || inputToken.symbol === MATIC.symbol

        if (isSellingNativeChainToken) {
          await issueExactSetFromETH(
            library,
            outputTokenAddress,
            amountOfSetToken,
            quoteData.tradeData,
            issuanceModule.address,
            issuanceModule.isDebtIssuance
          )
        } else {
          const maxAmountInputToken = quoteData.inputTokenAmount
          await issueExactSetFromToken(
            library,
            outputTokenAddress,
            inputTokenAddress,
            amountOfSetToken,
            maxAmountInputToken,
            quoteData.tradeData,
            issuanceModule.address,
            issuanceModule.isDebtIssuance
          )
        }
      } else {
        const isRedeemingNativeChainToken =
          inputToken.symbol === ETH.symbol || inputToken.symbol === MATIC.symbol
        const minAmountToReceive = tokenAmout

        if (isRedeemingNativeChainToken) {
          await redeemExactSetForETH(
            library,
            inputTokenAddress,
            minAmountToReceive,
            quoteData.tradeData,
            issuanceModule.address,
            issuanceModule.isDebtIssuance
          )
        } else {
          await redeemExactSetForToken(
            library,
            inputTokenAddress,
            outputTokenAddress,
            requiredBalance,
            minAmountToReceive,
            quoteData.tradeData,
            issuanceModule.address,
            issuanceModule.isDebtIssuance
          )
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
