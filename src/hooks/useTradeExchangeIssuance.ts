import { useCallback, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { useEthers } from '@usedapp/core'

import { MAINNET, POLYGON } from 'constants/chains'
import { ETH, MATIC, Token } from 'constants/tokens'
import { fromWei } from 'utils'
import { ExchangeIssuanceQuote } from 'utils/exchangeIssuanceQuotes'
import { getIssuanceModule } from 'utils/issuanceModule'

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
  const spendingTokenBalance =
    getBalance(inputToken.symbol) || BigNumber.from(0)

  const [isTransactingEI, setIsTransacting] = useState(false)

  const executeEITrade = useCallback(async () => {
    if (!account || !quoteData || !setTokenAmount) return

    const outputTokenAddress =
      chainId === POLYGON.chainId
        ? outputToken.polygonAddress
        : outputToken.address
    const inputTokenAddress =
      chainId === POLYGON.chainId
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

      const contract = await getExchangeIssuanceZeroExContract(
        library?.getSigner(),
        chainId ?? MAINNET.chainId
      )

      if (isIssuance) {
        const isSellingNativeChainToken =
          inputToken.symbol === ETH.symbol || inputToken.symbol === MATIC.symbol

        if (isSellingNativeChainToken) {
          await issueExactSetFromETH(
            contract,
            outputTokenAddress,
            setTokenAmount,
            quoteData.tradeData,
            issuanceModule.address,
            issuanceModule.isDebtIssuance,
            quoteData.inputTokenAmount,
            quoteData.gas
          )
        } else {
          const maxAmountInputToken = quoteData.inputTokenAmount
          await issueExactSetFromToken(
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
        }
      } else {
        const isRedeemingNativeChainToken =
          outputToken.symbol === ETH.symbol ||
          outputToken.symbol === MATIC.symbol
        const minOutputReceive = quoteData.inputTokenAmount

        if (isRedeemingNativeChainToken) {
          await redeemExactSetForETH(
            contract,
            inputTokenAddress,
            setTokenAmount,
            minOutputReceive,
            quoteData.tradeData,
            issuanceModule.address,
            issuanceModule.isDebtIssuance,
            quoteData.gas
          )
        } else {
          await redeemExactSetForToken(
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
