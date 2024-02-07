import { providers, utils } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { FlashMintQuoteProvider } from '@indexcoop/flash-mint-sdk'

import { MAINNET } from '@/constants/chains'
import { Token } from '@/constants/tokens'
import { GasStation } from '@/lib/utils/api/gas-station'
import { getConfiguredZeroExApi } from '@/lib/utils/api/zeroex'
import { getNetworkKey } from '@/lib/utils/api/zeroex-utils'
import { getFullCostsInUsd, getGasCostsInUsd } from '@/lib/utils/costs'
import { getFlashMintGasDefault } from '@/lib/utils/gas-defaults'
import { GasEstimatooor } from '@/lib/utils/gas-estimatooor'
import { getCurrencyTokensForIndex } from '@/lib/utils/tokens'
import { displayFromWei } from '@/lib/utils'

import { IndexQuoteRequest, Quote, QuoteTransaction, QuoteType } from '../types'
import { getIndexTokenAmount } from './index-token-amount'
import { getPriceImpact } from './price-impact'

async function getEnhancedFlashMintQuote(
  isMinting: boolean,
  inputToken: Token,
  outputToken: Token,
  indexTokenAmount: BigNumber,
  inputTokenPrice: number,
  outputTokenPrice: number,
  nativeTokenPrice: number,
  gasPrice: BigNumber,
  slippage: number,
  chainId: number,
  provider: JsonRpcProvider,
  signer: JsonRpcSigner
): Promise<Quote | null> {
  // Allow only on mainnet
  if (chainId !== MAINNET.chainId) return null
  const indexToken = isMinting ? outputToken : inputToken
  const inputOutputToken = isMinting ? inputToken : outputToken
  const currencies = getCurrencyTokensForIndex(indexToken, chainId)
  // Allow only supported currencies
  const isAllowedCurrency =
    currencies.filter((curr) => curr.symbol === inputOutputToken.symbol)
      .length > 0
  if (!isAllowedCurrency) return null
  try {
    // Create an instance of ZeroExApi (to pass to quote functions)
    const networkKey = getNetworkKey(chainId)
    const swapPathOverride = `/${networkKey}/swap/v1/quote`
    const zeroExApi = getConfiguredZeroExApi(swapPathOverride)
    const request = {
      isMinting,
      inputToken: { ...inputToken, address: inputToken.address! },
      outputToken: { ...outputToken, address: outputToken.address! },
      indexTokenAmount,
      slippage,
    }
    const quoteProvider = new FlashMintQuoteProvider(provider, zeroExApi)
    const quoteFM = await quoteProvider.getQuote(request)
    console.log(quoteFM)
    if (quoteFM) {
      const { inputOutputAmount, tx } = quoteFM
      const from = await signer.getAddress()
      const transaction: QuoteTransaction = {
        chainId: 1,
        from,
        to: tx.to,
        data: utils.hexlify(tx.data!),
        value: tx.value ? BigNumber.from(tx.value) : undefined,
      }
      const defaultGas = getFlashMintGasDefault(indexToken.symbol)
      const defaultGasEstimate = BigNumber.from(defaultGas)
      console.log('gas', defaultGas, defaultGasEstimate.toString())
      const gasEstimatooor = new GasEstimatooor(signer, defaultGasEstimate)
      // We don't want this function to fail for estimates here.
      // A default will be returned if the tx would fail.
      const canFail = false
      const gasEstimate = await gasEstimatooor.estimate(transaction, canFail)
      const gasCosts = gasEstimate.mul(gasPrice)
      const gasCostsInUsd = getGasCostsInUsd(gasCosts, nativeTokenPrice)
      transaction.gasLimit = gasEstimate
      console.log('gasLimit', transaction.gasLimit.toString())

      const inputTokenAmount = isMinting ? inputOutputAmount : indexTokenAmount
      const outputTokenAmount = isMinting ? indexTokenAmount : inputOutputAmount

      const inputTokenAmountUsd =
        parseFloat(
          displayFromWei(inputTokenAmount, 10, inputToken.decimals) ?? '0'
        ) * inputTokenPrice
      const outputTokenAmountUsd =
        parseFloat(
          displayFromWei(outputTokenAmount, 10, outputToken.decimals) ?? '0'
        ) * outputTokenPrice
      const priceImpact = getPriceImpact(
        inputTokenAmountUsd,
        outputTokenAmountUsd
      )

      const outputTokenAmountUsdAfterFees = outputTokenAmountUsd - gasCostsInUsd

      return {
        type: QuoteType.flashmint,
        chainId: 1,
        contract: quoteFM.contract,
        isMinting,
        inputToken,
        outputToken,
        gas: gasEstimate,
        gasPrice,
        gasCosts,
        gasCostsInUsd,
        fullCostsInUsd: getFullCostsInUsd(
          inputOutputAmount,
          gasEstimate.mul(gasPrice),
          inputToken.decimals,
          inputTokenPrice,
          nativeTokenPrice
        ),
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
  chainId: number
  inputTokenAmountWei: BigNumber
  nativeTokenPrice: number
}

export async function getFlashMintQuote(
  request: FlashMintQuoteRequest,
  provider: providers.JsonRpcProvider,
  signer: JsonRpcSigner
) {
  const {
    chainId,
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
    outputTokenPrice
  )

  const gasStation = new GasStation(provider)
  const gasPrice = await gasStation.getGasPrice()

  let savedQuote: Quote | null = null

  for (let t = 2; t > 0; t--) {
    const flashMintQuote = await getEnhancedFlashMintQuote(
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
      signer
    )
    // If there is no FlashMint quote, return immediately
    if (flashMintQuote === null) return savedQuote
    // For redeeming return quote immdediately
    if (!isMinting) return flashMintQuote
    savedQuote = flashMintQuote

    console.log('estimated index token amount', indexTokenAmount.toString())
    const diff = inputTokenAmountWei
      .sub(flashMintQuote.inputTokenAmount)
      .toBigInt()
    console.log('diff', diff.toString())
    const factor = determineFactor(diff, inputTokenAmountWei.toBigInt())
    console.log('factor', factor.toString())

    indexTokenAmount = (indexTokenAmount * factor) / BigInt(10000)
    console.log('new index token amount', indexTokenAmount.toString(), t)

    if (diff < 0 && t === 1) {
      t++ // loop one more time to stay under the input amount
    }
  }

  return savedQuote
}

const determineFactor = (diff: bigint, inputTokenAmount: bigint): bigint => {
  let ratio = Number(diff.toString()) / Number(inputTokenAmount.toString())
  console.log('ratio', ratio)
  if (Math.abs(ratio) < 0.0001) {
    // This is currently needed to avoid infinite loops
    ratio = diff < 0 ? -0.0001 : 0.0001
  }
  return BigInt(Math.round((1 + ratio) * 10000))
}
