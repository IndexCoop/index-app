import { PopulatedTransaction, utils } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { FlashMintQuoteProvider } from '@indexcoop/flash-mint-sdk'

import { MAINNET } from '@/constants/chains'
import { Token } from '@/constants/tokens'
import { getConfiguredZeroExApi } from '@/lib/utils/api/zeroex'
import { getNetworkKey } from '@/lib/utils/api/zeroex-utils'
import { getFullCostsInUsd, getGasCostsInUsd } from '@/lib/utils/costs'
import { GasEstimatooor } from '@/lib/utils/gasEstimatooor'
import { getCurrencyTokensForIndex } from '@/lib/utils/tokens'

import { EnhancedFlashMintQuote, QuoteType } from './'

export async function getEnhancedFlashMintQuote(
  isMinting: boolean,
  inputTokenAddress: string,
  outputTokenAddress: string,
  sellToken: Token,
  buyToken: Token,
  indexTokenAmount: BigNumber,
  sellTokenPrice: number,
  nativeTokenPrice: number,
  gasPrice: BigNumber,
  slippage: number,
  chainId: number,
  provider: JsonRpcProvider,
  signer: JsonRpcSigner
): Promise<EnhancedFlashMintQuote | null> {
  // Allow only on mainnet
  if (chainId !== MAINNET.chainId) return null
  const indexToken = isMinting ? buyToken : sellToken
  const inputOutputToken = isMinting ? sellToken : buyToken
  const currencies = getCurrencyTokensForIndex(indexToken, chainId, isMinting)
  // Allow only supported currencies
  const isAllowedCurrency =
    currencies.filter((curr) => curr.symbol === inputOutputToken.symbol)
      .length > 0
  if (!isAllowedCurrency) return null

  const inputToken = {
    symbol: sellToken.symbol,
    decimals: sellToken.decimals,
    address: inputTokenAddress,
  }
  const outputToken = {
    symbol: buyToken.symbol,
    decimals: buyToken.decimals,
    address: outputTokenAddress,
  }

  try {
    // Create an instance of ZeroExApi (to pass to quote functions)
    const networkKey = getNetworkKey(chainId)
    const swapPathOverride = `/${networkKey}/swap/v1/quote`
    const zeroExApi = getConfiguredZeroExApi(swapPathOverride)
    const request = {
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      slippage,
    }
    const quoteProvider = new FlashMintQuoteProvider(provider, zeroExApi)
    const quoteFM = await quoteProvider.getQuote(request)
    console.log(quoteFM)
    if (quoteFM) {
      const { inputOutputAmount, tx } = quoteFM
      const from = await signer.getAddress()
      let transaction: PopulatedTransaction = {
        chainId: 1,
        from,
        to: tx.to,
        data: utils.hexlify(tx.data!),
        value: tx.value ? BigNumber.from(tx.value) : undefined,
      }
      const defaultGasEstimate = BigNumber.from(6_000_000)
      const gasEstimatooor = new GasEstimatooor(signer, defaultGasEstimate)
      // We don't want this function to fail for estimates here.
      // A default will be returned if the tx would fail.
      const canFail = false
      tx.chainId = 1
      tx.from = from
      tx.gasLimit = defaultGasEstimate
      const gasEstimate = await gasEstimatooor.estimate(transaction, canFail)
      const gasCosts = gasEstimate.mul(gasPrice)
      const gasCostsInUsd = getGasCostsInUsd(gasCosts, nativeTokenPrice)
      transaction.gasLimit = gasEstimate
      return {
        type: QuoteType.flashMint,
        isMinting,
        inputToken: sellToken,
        outputToken: buyToken,
        gas: gasEstimate,
        gasPrice,
        gasCosts,
        gasCostsInUsd,
        fullCostsInUsd: getFullCostsInUsd(
          inputOutputAmount,
          gasEstimate.mul(gasPrice),
          sellToken.decimals,
          sellTokenPrice,
          nativeTokenPrice
        ),
        priceImpact: 0,
        indexTokenAmount,
        inputOutputTokenAmount: inputOutputAmount,
        // type specific properties
        contractType: quoteFM.contractType.toString(),
        contract: quoteFM.contract,
        tx: transaction,
      }
    }
  } catch (e) {
    console.warn('Error fetching FlashMintQuote', e)
  }

  return null
}
