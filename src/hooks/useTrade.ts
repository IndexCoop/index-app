import { useCallback, useEffect, useState } from 'react'

import { usePrepareSendTransaction, useSendTransaction } from 'wagmi'

import { TransactionRequest } from '@ethersproject/abstract-provider'
import { BigNumber } from '@ethersproject/bignumber'

import { ZeroExQuote } from 'hooks/useBestQuote'
import { useWallet } from 'hooks/useWallet'
import { fromWei } from 'utils'

import { useBalances } from './useBalance'

export const useTrade = () => {
  const { address } = useWallet()
  const [zeroExQuote, setZeroExQuote] = useState<ZeroExQuote | null>(null)

  const txRequest: TransactionRequest = {
    chainId: Number(zeroExQuote?.chainId) ?? undefined,
    from: address ?? undefined,
    to: zeroExQuote?.to,
    data: zeroExQuote?.data,
    value: BigNumber.from(zeroExQuote?.value ?? 0),
    // gas: undefined, use metamask estimated gas limit
  }
  const { config } = usePrepareSendTransaction({
    request: txRequest,
  })
  const { sendTransaction, status } = useSendTransaction(config)
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

      setZeroExQuote(quote)
      try {
        setIsTransacting(true)
        sendTransaction?.()
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
