import { useCallback, useEffect, useState } from 'react'

import { useSendTransaction } from 'wagmi'

import { TransactionRequest } from '@ethersproject/abstract-provider'
import { BigNumber } from '@ethersproject/bignumber'

import { Token } from 'constants/tokens'
import { useWallet } from 'hooks/useWallet'
import { fromWei } from 'utils'
import { ZeroExData } from 'utils/zeroExUtils'

import { useBalances } from './useBalance'

export const useTrade = (sellToken: Token, tradeData?: ZeroExData | null) => {
  const { address } = useWallet()
  const { sendTransaction, status } = useSendTransaction()
  const { getBalance } = useBalances()
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
      sendTransaction({ request: txRequest })
    } catch (error) {
      setIsTransacting(false)
      console.log('Error sending transaction', error)
    }
  }, [address, tradeData])

  useEffect(() => {
    if (status !== 'idle' && status) setIsTransacting(false)
  }, [status])

  return { executeTrade, isTransacting }
}
