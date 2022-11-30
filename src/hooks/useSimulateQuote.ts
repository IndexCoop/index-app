import { BigNumber, PopulatedTransaction } from 'ethers'

import { JsonRpcProvider } from '@ethersproject/providers'

import { useNetwork } from 'hooks/useNetwork'
import { useWallet } from 'hooks/useWallet'
import { getFlashMintLeveragedTransaction } from 'utils/flashMintLeveragedTransaction'
import { getFlashMintNotionalTransaction } from 'utils/flashMintNotional/fmNotionalTransaction'
import { getFlashMintZeroExTransaction } from 'utils/flashMintZeroExTransaction'
import { TxSimulator } from 'utils/simulator'

import { FlashMintQuoteResult } from './useFlashMintQuote'

export const useSimulateQuote = (quoteResult: FlashMintQuoteResult) => {
  const { chainId } = useNetwork()
  const { provider, signer } = useWallet()

  async function simulateTrade(): Promise<boolean> {
    if (!chainId) return false
    const builder = new TransactionRequestBuilder(provider, signer, chainId)
    const request = await builder.makeTransactionRequest(quoteResult)
    if (!request) return false
    const accessKey = process.env.REACT_APP_TENDERLY_ACCESS_KEY ?? ''
    const simulator = new TxSimulator(accessKey)
    const success = await simulator.simulate(request)
    return success
  }

  return { simulateTrade }
}

class TransactionRequestBuilder {
  constructor(
    readonly provider: JsonRpcProvider,
    readonly signer: any,
    readonly chainId: number
  ) {}

  async makeTransactionRequest(
    quoteResult: FlashMintQuoteResult
  ): Promise<PopulatedTransaction | null> {
    const { chainId, provider, signer } = this
    const { inputTokenBalance, slippage } = quoteResult
    const {
      flashMintLeveraged: quoteLeveraged,
      flashMintNotional: quoteNotional,
      flashMintZeroEx: quoteZeroEx,
    } = quoteResult.quotes
    let request: PopulatedTransaction | null = null

    if (quoteLeveraged) {
      request = await getFlashMintLeveragedTransaction(
        quoteLeveraged.isMinting,
        quoteLeveraged.inputToken,
        quoteLeveraged.outputToken,
        quoteLeveraged.indexTokenAmount,
        quoteLeveraged.inputOutputTokenAmount,
        inputTokenBalance,
        quoteLeveraged.swapDataDebtCollateral,
        quoteLeveraged.swapDataPaymentToken,
        provider,
        signer,
        chainId
      )
    }

    if (quoteNotional) {
      request = await getFlashMintNotionalTransaction(
        quoteNotional.isMinting,
        quoteNotional.inputToken,
        quoteNotional.outputToken,
        quoteNotional.indexTokenAmount,
        quoteNotional.inputOutputTokenAmount,
        quoteNotional.swapData,
        slippage,
        provider,
        signer,
        chainId
      )
    }

    if (quoteZeroEx) {
      request = await getFlashMintZeroExTransaction(
        quoteZeroEx.isMinting,
        quoteZeroEx.inputToken,
        quoteZeroEx.outputToken,
        quoteZeroEx.indexTokenAmount,
        quoteZeroEx.inputOutputTokenAmount,
        inputTokenBalance,
        quoteZeroEx.componentQuotes,
        provider,
        signer,
        chainId
      )
    }
    return request
  }
}
