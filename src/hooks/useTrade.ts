import { useCallback, useEffect, useState } from 'react'

import { TransactionRequest } from '@ethersproject/abstract-provider'
import { BigNumber } from '@ethersproject/bignumber'
import { useEtherBalance, useEthers, useSendTransaction } from '@usedapp/core'

import { DAI, ETH, MATIC, USDC } from 'constants/tokens'
import { fromWei } from 'utils'
import { ZeroExData } from 'utils/zeroExUtils'

import { useBalances } from './useBalances'

export const useTrade = (tradeData?: ZeroExData | null) => {
  const { account, library } = useEthers()
  const { usdcBalance, daiBalance, maticBalance, wethBalance } = useBalances()
  const etherBalance = useEtherBalance(account)
  const { sendTransaction, state } = useSendTransaction({
    transactionName: 'trade',
  })
  const [isTransacting, setIsTransacting] = useState(false)

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

    if (spendingTokenBalance.lt(requiredBalance)) return

    const txRequest: TransactionRequest = {
      chainId: Number(tradeData.chainId) ?? undefined,
      from: account,
      to: tradeData.to,
      data: tradeData.data,
      value: BigNumber.from(tradeData.value),
      // gas: undefined, use metamask estimated gas limit
    }

    try {
      setIsTransacting(true)
      // const tx = await library?.getSigner().sendTransaction(txRequest)
      await sendTransaction(txRequest)
    } catch (error) {
      setIsTransacting(false)
      console.log('Error sending transaction', error)
    }
  }, [account, tradeData])

  useEffect(() => {
    if (state.status !== 'Mining') setIsTransacting(false)
  }, [state])

  return { executeTrade, isTransacting }
}
