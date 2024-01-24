import { utils } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { FlashMintQuoteProvider } from '@indexcoop/flash-mint-sdk'

import { MAINNET } from '@/constants/chains'
import { Token } from '@/constants/tokens'
import { getConfiguredZeroExApi } from '@/lib/utils/api/zeroex'
import { getNetworkKey } from '@/lib/utils/api/zeroex-utils'
import { getFullCostsInUsd, getGasCostsInUsd } from '@/lib/utils/costs'
import { getFlashMintGasDefault } from '@/lib/utils/gas-defaults'
import { GasEstimatooor } from '@/lib/utils/gas-estimatooor'
import { getCurrencyTokensForIndex } from '@/lib/utils/tokens'
import { displayFromWei } from '@/lib/utils'

import { Quote, QuoteTransaction, QuoteType } from '../types'
import { getPriceImpact } from './price-impact'

export async function getEnhancedFlashMintQuote(
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
      transaction.gasLimit = await gasEstimatooor.estimate(transaction)
      console.log('gasLimit', transaction.gasLimit.toString())
      // We don't want this function to fail for estimates here.
      // A default will be returned if the tx would fail.
      const canFail = false
      const gasEstimate = await gasEstimatooor.estimate(transaction, canFail)
      const gasCosts = gasEstimate.mul(gasPrice)
      const gasCostsInUsd = getGasCostsInUsd(gasCosts, nativeTokenPrice)
      transaction.gasLimit = gasEstimate

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
