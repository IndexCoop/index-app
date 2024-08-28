import { BigNumber } from '@ethersproject/bignumber'
import { FlashMintQuoteProvider } from '@indexcoop/flash-mint-sdk'
import { utils } from 'ethers'

import { Token } from '@/constants/tokens'
import { IndexRpcProvider } from '@/lib/hooks/use-wallet'
import { formatWei } from '@/lib/utils'
import { getConfiguredZeroExSwapQuoteProvider } from '@/lib/utils/api/zeroex'
import { getFullCostsInUsd, getGasCostsInUsd } from '@/lib/utils/costs'
import { getFlashMintGasDefault } from '@/lib/utils/gas-defaults'
import { GasEstimatooor } from '@/lib/utils/gas-estimatooor'
import {
  getAddressForToken,
  getCurrencyTokensForIndex,
} from '@/lib/utils/tokens'

import { IndexQuoteRequest, Quote, QuoteTransaction, QuoteType } from '../types'

import { getIndexTokenAmount } from './index-token-amount'
import { getPriceImpact } from './price-impact'

async function getEnhancedFlashMintQuote(
  account: string,
  isMinting: boolean,
  inputToken: Token,
  outputToken: Token,
  indexTokenAmount: BigNumber,
  inputTokenPrice: number,
  outputTokenPrice: number,
  nativeTokenPrice: number,
  gasPrice: bigint,
  slippage: number,
  chainId: number,
  provider: IndexRpcProvider,
  rpcUrl: string,
): Promise<Quote | null> {
  const inputTokenAddress = getAddressForToken(inputToken, chainId)
  const outputTokenAddress = getAddressForToken(outputToken, chainId)
  if (!inputTokenAddress || !outputTokenAddress) {
    console.warn('Error unkown input/output token')
    return null
  }
  const indexToken = isMinting ? outputToken : inputToken
  const inputOutputToken = isMinting ? inputToken : outputToken
  const currencies = getCurrencyTokensForIndex(indexToken, chainId)
  // Allow only supported currencies
  const isAllowedCurrency =
    currencies.filter((curr) => curr.symbol === inputOutputToken.symbol)
      .length > 0
  if (!isAllowedCurrency) return null
  try {
    const swapQuoteProvider = getConfiguredZeroExSwapQuoteProvider(chainId)
    const request = {
      isMinting,
      inputToken: { ...inputToken, address: inputTokenAddress },
      outputToken: { ...outputToken, address: outputTokenAddress },
      indexTokenAmount,
      slippage,
    }
    const quoteProvider = new FlashMintQuoteProvider(rpcUrl, swapQuoteProvider)
    const quoteFM = await quoteProvider.getQuote(request)
    // console.log(quoteFM)
    if (quoteFM) {
      const { inputOutputAmount, tx } = quoteFM
      const transaction: QuoteTransaction = {
        account,
        chainId,
        from: account,
        to: tx.to,
        data: utils.hexlify(tx.data!),
        value: tx.value ? BigNumber.from(tx.value) : undefined,
      }
      const defaultGas = getFlashMintGasDefault(indexToken.symbol)
      const defaultGasEstimate = BigInt(defaultGas)
      const gasEstimatooor = new GasEstimatooor(provider, defaultGasEstimate)
      // We don't want this function to fail for estimates here.
      // A default will be returned if the tx would fail.
      const canFail = false
      const gasEstimate = await gasEstimatooor.estimate(transaction, canFail)
      const gasCosts = gasEstimate * gasPrice
      const gasCostsInUsd = getGasCostsInUsd(gasCosts, nativeTokenPrice)
      transaction.gasLimit = BigNumber.from(gasEstimate.toString())

      const inputTokenAmount = isMinting ? inputOutputAmount : indexTokenAmount
      const outputTokenAmount = isMinting ? indexTokenAmount : inputOutputAmount

      const inputTokenAmountUsd =
        parseFloat(
          formatWei(inputTokenAmount.toBigInt(), inputToken.decimals),
        ) * inputTokenPrice
      const outputTokenAmountUsd =
        parseFloat(
          formatWei(outputTokenAmount.toBigInt(), outputToken.decimals),
        ) * outputTokenPrice
      const priceImpact = getPriceImpact(
        inputTokenAmountUsd,
        outputTokenAmountUsd,
      )

      const outputTokenAmountUsdAfterFees = outputTokenAmountUsd - gasCostsInUsd

      const fullCostsInUsd = getFullCostsInUsd(
        inputTokenAmount.toBigInt(),
        gasEstimate * gasPrice,
        inputToken.decimals,
        inputTokenPrice,
        nativeTokenPrice,
      )

      return {
        type: QuoteType.flashmint,
        chainId,
        contract: quoteFM.contract,
        isMinting,
        inputToken,
        outputToken,
        gas: BigNumber.from(gasEstimate.toString()),
        gasPrice: BigNumber.from(gasPrice.toString()),
        gasCosts: BigNumber.from(gasCosts.toString()),
        gasCostsInUsd,
        fullCostsInUsd,
        priceImpact,
        indexTokenAmount,
        inputOutputTokenAmount: inputOutputAmount,
        inputTokenAmount,
        inputTokenAmountUsd,
        outputTokenAmount,
        outputTokenAmountUsd,
        outputTokenAmountUsdAfterFees,
        inputTokenPrice,
        outputTokenPrice,
        slippage,
        tx: transaction,
      }
    }
  } catch (e) {
    console.warn('Error fetching FlashMintQuote', e)
  }
  return null
}

interface FlashMintQuoteRequest extends IndexQuoteRequest {
  account: string
  chainId: number
  inputTokenAmountWei: BigNumber
  nativeTokenPrice: number
}

export async function getFlashMintQuote(
  request: FlashMintQuoteRequest,
  provider: IndexRpcProvider,
  rpcUrl: string,
) {
  const {
    chainId,
    account,
    inputToken,
    inputTokenAmount,
    inputTokenAmountWei,
    inputTokenPrice,
    isMinting,
    nativeTokenPrice,
    outputToken,
    outputTokenPrice,
    slippage,
  } = request

  /* Determine initial index token amount based on different factors */
  let indexTokenAmount = getIndexTokenAmount(
    isMinting,
    inputTokenAmount,
    inputToken.decimals,
    outputToken.decimals,
    inputTokenPrice,
    outputTokenPrice,
  )

  const gasPrice = await provider.getGasPrice()

  let savedQuote: Quote | null = null

  for (let t = 2; t > 0; t--) {
    const flashMintQuote = await getEnhancedFlashMintQuote(
      account,
      isMinting,
      inputToken,
      outputToken,
      BigNumber.from(indexTokenAmount.toString()),
      inputTokenPrice,
      outputTokenPrice,
      nativeTokenPrice,
      gasPrice,
      slippage,
      chainId,
      provider,
      rpcUrl,
    )
    // If there is no FlashMint quote, return immediately
    if (flashMintQuote === null) return savedQuote
    // For redeeming return quote immdediately
    if (!isMinting) return flashMintQuote
    savedQuote = flashMintQuote

    const diff = inputTokenAmountWei
      .sub(flashMintQuote.inputTokenAmount)
      .toBigInt()
    const factor = determineFactor(diff, inputTokenAmountWei.toBigInt())

    indexTokenAmount = (indexTokenAmount * factor) / BigInt(10000)

    if (diff < 0 && t === 1) {
      t++ // loop one more time to stay under the input amount
    }
  }

  return savedQuote
}

const determineFactor = (diff: bigint, inputTokenAmount: bigint): bigint => {
  let ratio = Number(diff.toString()) / Number(inputTokenAmount.toString())
  if (Math.abs(ratio) < 0.0001) {
    // This is currently needed to avoid infinite loops
    ratio = diff < 0 ? -0.0001 : 0.0001
  }
  return BigInt(Math.round((1 + ratio) * 10000))
}
