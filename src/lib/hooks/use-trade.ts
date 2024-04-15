import { useCallback, useState } from 'react'
import { Address, Hex, PublicClient } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'

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
  const chainId = publicClient.chain?.id
  if (!chainId) return BigInt(0)
  const balanceProvider = new BalanceProvider(publicClient)
  return isNativeCurrency(inputToken, chainId)
    ? await balanceProvider.getNativeBalance(address)
    : await balanceProvider.getErc20Balance(address, inputToken.address!)
}

export const useTrade = () => {
  const publicClient = usePublicClient()
  const { address } = useWallet()
  const { chainId } = useNetwork()
  const { logTransaction } = useAnalytics()
  const { data: walletClient } = useWalletClient()

  const [isTransacting, setIsTransacting] = useState(false)
  const [txWouldFail, setTxWouldFail] = useState(false)

  const executeTrade = useCallback(
    async (quote: Quote | null, override: boolean = false) => {
      if (!address || !chainId || !publicClient || !walletClient || !quote)
        return
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
        const hash = await walletClient.sendTransaction({
          account: address,
          chainId: Number(quote.chainId),
          gas: gasLimit,
          to: quote.tx.to as Address,
          data: quote.tx.data as Hex,
          value: BigInt(quote.tx.value?.toString() ?? '0'),
        })
        logTransaction(chainId ?? -1, hash, formatQuoteAnalytics(quote))
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
    [address, chainId, logTransaction, publicClient, walletClient],
  )

  return { executeTrade, isTransacting, txWouldFail }
}
