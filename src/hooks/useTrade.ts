import { useCallback } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { useEtherBalance, useEthers, useSendTransaction } from '@usedapp/core'

import { DAI, ETH, MATIC, USDC } from 'constants/tokens'
import { fromWei } from 'utils'
import { ZeroExData } from 'utils/zeroExUtils'

import { useBalances } from './useBalances'

export const useTrade = (tradeData?: ZeroExData | null) => {
  const { account } = useEthers()
  const { sendTransaction, state } = useSendTransaction({
    transactionName: 'Trade',
  })
  const { usdcBalance, daiBalance, maticBalance, wethBalance } = useBalances()
  const etherBalance = useEtherBalance(account)

  let spendingTokenBalance = BigNumber.from(0)
  switch (tradeData?.sellTokenAddress) {
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

  const executeTrade = useCallback(async () => {
    if (!account || !tradeData || !tradeData?.sellAmount) return

    const isSellingUSDC =
      tradeData.sellTokenAddress === USDC.address ||
      tradeData.sellTokenAddress === USDC.polygonAddress
    let requiredBalance = isSellingUSDC
      ? fromWei(BigNumber.from(tradeData.sellAmount), 6)
      : fromWei(BigNumber.from(tradeData.sellAmount))

    console.log('isSellingUSDC', isSellingUSDC)
    console.log(requiredBalance.toString(), tradeData.sellAmount)

    if (spendingTokenBalance.lt(requiredBalance)) return

    tradeData.from = account
    tradeData.gas = undefined // use metamask estimated gas limit

    try {
      sendTransaction(tradeData).then((data) => {
        console.log('trade executed', data)
      })
    } catch (error) {
      // TODO:
      console.log(error)
    }
  }, [account, tradeData])

  return { executeTrade }
}
