import { useCallback, useEffect, useState } from 'react'

import { useSendTransaction } from 'wagmi'

import { TransactionRequest } from '@ethersproject/abstract-provider'
import { BigNumber } from '@ethersproject/bignumber'

import { ZeroExQuote } from 'hooks/useBestTradeOption'
import { useWallet } from 'hooks/useWallet'
import { fromWei } from 'utils'

import { useBalances } from './useBalance'

export const useTrade = () => {
  const { address } = useWallet()
  const { sendTransaction, status } = useSendTransaction()
  const { getBalance } = useBalances()

  const [isTransacting, setIsTransacting] = useState(false)

  const executeTrade = useCallback(
    async (quote: ZeroExQuote | null) => {
      if (!address || !quote) return

      const inputToken = quote.inputToken
      const inputTokenAmount = quote.isIssuance
        ? quote.inputOutputTokenAmount
        : quote.setTokenAmount

      let requiredBalance = fromWei(
        BigNumber.from(inputTokenAmount),
        inputToken.decimals
      )
      const spendingTokenBalance =
        getBalance(inputToken.symbol) || BigNumber.from(0)
      if (spendingTokenBalance.lt(requiredBalance)) return

      const txRequest: TransactionRequest = {
        chainId: Number(quote.chainId) ?? undefined,
        from: address,
        to: quote.to,
        data: quote.data,
        value: BigNumber.from(quote.value),
        // gas: undefined, use metamask estimated gas limit
      }

      try {
        setIsTransacting(true)
        sendTransaction({ request: txRequest })
      } catch (error) {
        setIsTransacting(false)
        console.log('Error sending transaction', error)
      }
    },
    [address]
  )

  useEffect(() => {
    if (status !== 'idle' && status) setIsTransacting(false)
  }, [status])

  return { executeTrade, isTransacting }
}
