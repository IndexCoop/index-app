import { useCallback, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, useEthers } from '@usedapp/core'

import { ETH, MATIC, Token } from 'constants/tokens'
import { fromWei } from 'utils'
import { ExchangeIssuanceQuote } from 'utils/exchangeIssuanceQuotes'
import { getIssuanceModule } from 'utils/issuanceModule'

import { useBalance } from './useBalance'
import { useExchangeIssuanceZeroEx } from './useExchangeIssuanceZeroEx'

export const useTradeExchangeIssuance = (
  isIssuance: boolean,
  inputToken: Token,
  outputToken: Token,
  quoteData?: ExchangeIssuanceQuote | null
) => {
  const { account, chainId, library } = useEthers()
  const {
    issueExactSetFromETH,
    issueExactSetFromToken,
    redeemExactSetForETH,
    redeemExactSetForToken,
  } = useExchangeIssuanceZeroEx()
  const { getBalance } = useBalance()

  const setTokenAmount = quoteData?.setTokenAmount
  const setTokenSymbol = isIssuance ? outputToken.symbol : inputToken.symbol
  const issuanceModule = getIssuanceModule(setTokenSymbol, chainId)
  const spendingTokenBalance = getBalance(inputToken) || BigNumber.from(0)

  const [isTransactingEI, setIsTransacting] = useState(false)

  const executeEITrade = useCallback(async () => {
    if (!account || !quoteData || !setTokenAmount) return

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
        const isSellingNativeChainToken =
          inputToken.symbol === ETH.symbol || inputToken.symbol === MATIC.symbol

        if (isSellingNativeChainToken) {
          await issueExactSetFromETH(
            library,
            outputTokenAddress,
            setTokenAmount,
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
            setTokenAmount,
            maxAmountInputToken,
            quoteData.tradeData,
            issuanceModule.address,
            issuanceModule.isDebtIssuance
          )
        }
      } else {
        const isRedeemingNativeChainToken =
          inputToken.symbol === ETH.symbol || inputToken.symbol === MATIC.symbol
        const minOutputReceive = quoteData.inputTokenAmount

        if (isRedeemingNativeChainToken) {
          await redeemExactSetForETH(
            library,
            inputTokenAddress,
            setTokenAmount,
            minOutputReceive,
            quoteData.tradeData,
            issuanceModule.address,
            issuanceModule.isDebtIssuance
          )
        } else {
          await redeemExactSetForToken(
            library,
            inputTokenAddress,
            outputTokenAddress,
            setTokenAmount,
            minOutputReceive,
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
