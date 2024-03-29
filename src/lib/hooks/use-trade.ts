import { useCallback, useState } from 'react'
import { Hex } from 'viem'
import { PublicClient, usePublicClient } from 'wagmi'
import { prepareSendTransaction, sendTransaction } from '@wagmi/core'

import { BigNumber } from '@ethersproject/bignumber'

import { Token } from '@/constants/tokens'
import { Quote, QuoteType } from '@/lib/hooks/use-best-quote/types'
import { useNetwork } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'
import {
  GasEstimatooor,
  GasEstimatooorFailedError,
} from '@/lib/utils/gas-estimatooor'
import { getAddressForToken, isNativeCurrency } from '@/lib/utils/tokens'

import { BalanceProvider } from './use-balance'
import { formatQuoteAnalytics, useAnalytics } from './use-analytics'

async function getInputTokenBalance(
  inputToken: Token,
  address: string,
  publicClient: PublicClient,
): Promise<bigint> {
  const balanceProvider = new BalanceProvider(publicClient)
  return isNativeCurrency(inputToken, publicClient.chain.id)
    ? await balanceProvider.getNativeBalance(address)
    : await balanceProvider.getErc20Balance(address, inputToken.address!)
}

export const useTrade = () => {
  const publicClient = usePublicClient()
  const { address } = useWallet()
  const { chainId } = useNetwork()
  const { logTransaction } = useAnalytics()

  const [isTransacting, setIsTransacting] = useState(false)
  const [txWouldFail, setTxWouldFail] = useState(false)

  const executeTrade = useCallback(
    async (quote: Quote | null, override: boolean = false) => {
      if (!address || !chainId || !quote) return
      const { inputToken, inputTokenAmount, outputToken } = quote

      // Check that input/ouput token are known
      const inputTokenAddress = getAddressForToken(inputToken, chainId)
      const outputTokenAddress = getAddressForToken(outputToken, chainId)
      if (!outputTokenAddress || !inputTokenAddress) return

      // Check is user has sufficient funds
      const inputTokenBalance = await getInputTokenBalance(
        inputToken,
        address,
        publicClient,
      )
      if (BigInt(inputTokenAmount.toString()) > inputTokenBalance) return

      try {
        setIsTransacting(true)
        const { tx } = quote
        const defaultGasEstimate =
          quote.type === QuoteType.flashmint
            ? BigInt(6_000_000)
            : BigInt(250_000)
        const gasEstimatooor = new GasEstimatooor(
          publicClient,
          defaultGasEstimate,
        )
        // Will throw error if tx would fail
        // If the user overrides, we take any gas estimate
        const canFail = override
        const gasLimit = await gasEstimatooor.estimate(tx, canFail)
        tx.gasLimit = BigNumber.from(gasLimit.toString())
        const request = await prepareSendTransaction({
          account: address,
          chainId: Number(quote.chainId),
          gas: BigInt(gasLimit.toString()),
          to: quote.tx.to,
          data: quote.tx.data as Hex,
          value: BigInt(quote.tx.value?.toString() ?? '0'),
        })
        const { hash } = await sendTransaction(request)
        logTransaction(chainId ?? -1, hash, formatQuoteAnalytics(quote))
        console.log('hash:', hash)
        setIsTransacting(false)
      } catch (error) {
        console.log('Override?', override)
        console.log('Error sending transaction', error)
        setIsTransacting(false)
        if (
          error instanceof GasEstimatooorFailedError &&
          error.statusCode === 1001
        ) {
          setTxWouldFail(true)
        }
        throw error
      }
    },
    [address, chainId, logTransaction, publicClient],
  )

  return { executeTrade, isTransacting, txWouldFail }
}
