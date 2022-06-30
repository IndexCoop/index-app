import { useCallback, useEffect, useState } from 'react'

import { TransactionRequest } from '@ethersproject/abstract-provider'
import { BigNumber } from '@ethersproject/bignumber'
import { useSendTransaction } from '@usedapp/core'

import { Token } from 'constants/tokens'
import { useWallet } from 'hooks/useWallet'
import { fromWei } from 'utils'
import { ZeroExData } from 'utils/zeroExUtils'

import { useBalance } from './useBalance'

export const useTrade = (sellToken: Token, tradeData?: ZeroExData | null) => {
  const { address } = useWallet()
  const { sendTransaction, state } = useSendTransaction({
    transactionName: 'trade',
  })
  const { getBalance } = useBalance()
  const spendingTokenBalance = getBalance(sellToken.symbol) || BigNumber.from(0)

  const [isTransacting, setIsTransacting] = useState(false)

  const executeTrade = useCallback(async () => {
    if (!address || !tradeData || !tradeData?.sellAmount) return

    let requiredBalance = fromWei(
      BigNumber.from(tradeData.sellAmount),
      sellToken.decimals
    )

    if (spendingTokenBalance.lt(requiredBalance)) return

    const txRequest: TransactionRequest = {
      chainId: Number(tradeData.chainId) ?? undefined,
      from: address,
      to: tradeData.to,
      data: tradeData.data,
      value: BigNumber.from(tradeData.value),
      // gas: undefined, use metamask estimated gas limit
    }

    try {
      setIsTransacting(true)
      await sendTransaction(txRequest)
    } catch (error) {
      setIsTransacting(false)
      console.log('Error sending transaction', error)
    }
  }, [address, tradeData])

  useEffect(() => {
    if (state.status !== 'Mining') setIsTransacting(false)
  }, [state])

  return { executeTrade, isTransacting }
}
