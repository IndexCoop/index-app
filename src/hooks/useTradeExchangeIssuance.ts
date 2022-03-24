import { useCallback, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { useEthers } from '@usedapp/core'

import { ETH, MATIC, Token } from 'constants/tokens'
import { fromWei } from 'utils'
import { ExchangeIssuanceQuote } from 'utils/exchangeIssuanceQuotes'
import { getIssuanceModule } from 'utils/issuanceModule'

import { useExchangeIssuanceZeroEx } from './useExchangeIssuanceZeroEx'
import { useTokenBalance } from './useTokenBalance'

export const useTradeExchangeIssuance = (
  isIssuance: boolean,
  sellToken: Token,
  buyToken: Token,
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
  const spendingTokenBalance = useTokenBalance(sellToken) || BigNumber.from(0)

  const [isTransactingEI, setIsTransacting] = useState(false)

  const tokenSymbol = isIssuance ? buyToken.symbol : sellToken.symbol
  const issuanceModule = getIssuanceModule(tokenSymbol, chainId)

  const executeEITrade = useCallback(async () => {
    if (!account || !quoteData) return

    const isSellingNativeChainToken =
      sellToken.symbol === ETH.symbol || sellToken.symbol === MATIC.symbol

    let requiredBalance = fromWei(
      tokenAmout,
      issuanceModule ? sellToken.decimals : buyToken.decimals
    )

    if (spendingTokenBalance.lt(requiredBalance)) return

    try {
      setIsTransacting(true)
      if (isSellingNativeChainToken) {
        await issueExactSetFromETH(
          library,
          buyToken.address!,
          tokenAmout,
          quoteData.tradeData,
          issuanceModule.address,
          issuanceModule.isDebtIssuance
        )
      }
      setIsTransacting(false)
    } catch (error) {
      setIsTransacting(false)
      console.log('Error sending transaction', error)
    }
  }, [account, quoteData])

  return { executeEITrade, isTransactingEI }
}
