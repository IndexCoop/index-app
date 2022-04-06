import { useCallback, useEffect, useState } from 'react'

import { TransactionRequest } from '@ethersproject/abstract-provider'
import { BigNumber } from '@ethersproject/bignumber'
import { useEthers, useSendTransaction } from '@usedapp/core'

import { Token } from 'constants/tokens'
import { fromWei } from 'utils'
import { ZeroExData } from 'utils/zeroExUtils'

import { useTokenBalance } from './useTokenBalance'

export const useTrade = (sellToken: Token, tradeData?: ZeroExData | null) => {
  const { account, library } = useEthers()
  const { sendTransaction, state } = useSendTransaction({
    transactionName: 'trade',
  })
  const { getBalance } = useTokenBalance()
  const spendingTokenBalance = getBalance(sellToken) || BigNumber.from(0)

  const [isTransacting, setIsTransacting] = useState(false)

  const executeTrade = useCallback(async () => {
    if (!account || !tradeData || !tradeData?.sellAmount) return

    let requiredBalance = fromWei(
      BigNumber.from(tradeData.sellAmount),
      sellToken.decimals
    )

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
