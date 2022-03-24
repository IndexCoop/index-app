import { useCallback, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { useEtherBalance, useEthers } from '@usedapp/core'

import { DAI, ETH, MATIC, Token, USDC } from 'constants/tokens'
import { useExchangeIssuanceZeroEx } from 'hooks/useExchangeIssuanceZeroEx'
import { fromWei, getChainAddress } from 'utils'
import { ExchangeIssuanceQuote } from 'utils/exchangeIssuanceQuotes'
import { getIssuanceModule } from 'utils/issuanceModule'

import { useBalances } from './useBalances'

export const useTradeExchangeIssuance = (
  isIssuance: boolean,
  sellToken: Token,
  buyToken: Token,
  tokenAmout: BigNumber,
  quoteData?: ExchangeIssuanceQuote | null
) => {
  const { account, chainId, library } = useEthers()
  const { usdcBalance, daiBalance, maticBalance, wethBalance } = useBalances()
  const etherBalance = useEtherBalance(account)
  const {
    issueExactSetFromETH,
    issueExactSetFromToken,
    redeemExactSetForETH,
    redeemExactSetForToken,
  } = useExchangeIssuanceZeroEx()

  const [isTransactingEI, setIsTransacting] = useState(false)

  const tokenSymbol = isIssuance ? buyToken.symbol : sellToken.symbol
  const issuanceModule = getIssuanceModule(tokenSymbol, chainId)
  const sellTokenAddress = getChainAddress(sellToken, chainId)

  // TODO: replace with utility function?
  let spendingTokenBalance = BigNumber.from(0)
  switch (sellTokenAddress) {
    case USDC.address || USDC.polygonAddress:
      spendingTokenBalance = usdcBalance || BigNumber.from(0)
      break
    case DAI.address || DAI.polygonAddress:
      spendingTokenBalance = daiBalance || BigNumber.from(0)
      break
    case MATIC.address || MATIC.polygonAddress:
      spendingTokenBalance = maticBalance || BigNumber.from(0)
      break
    case ETH.polygonAddress:
      spendingTokenBalance = wethBalance || BigNumber.from(0)
      break
    default:
      spendingTokenBalance = etherBalance || BigNumber.from(0)
  }

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
      if (isSellingNativeChainToken) {
        setIsTransacting(true)
        await issueExactSetFromETH(
          library,
          buyToken.address!,
          tokenAmout,
          quoteData.tradeData,
          issuanceModule.address,
          issuanceModule.isDebtIssuance
        )
      }
    } catch (error) {
      setIsTransacting(false)
      console.log('Error sending transaction', error)
    }
  }, [account, quoteData])

  return { executeEITrade, isTransactingEI }
}
