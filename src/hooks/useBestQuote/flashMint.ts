import { PopulatedTransaction, utils } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { FlashMintQuoteProvider } from '@indexcoop/flash-mint-sdk'

import { MAINNET } from 'constants/chains'
import { DefaultGasLimitFlashMintZeroEx } from 'constants/gas'
import { MoneyMarketIndex, Token } from 'constants/tokens'
import { getFullCostsInUsd, getGasCostsInUsd } from 'utils/costs'
import { GasEstimatooor } from 'utils/gasEstimatooor'
import { getCurrencyTokensForIndex } from 'utils/tokens'

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
  console.log(indexToken, inputOutputToken)
  // Allow only MMI
  if (indexToken.symbol !== MoneyMarketIndex.symbol) return null
  const currencies = getCurrencyTokensForIndex(
    MoneyMarketIndex,
    chainId,
    isMinting
  )
  // Allow only supported currencies
  const isAllowedCurrency =
    currencies.filter((curr) => curr.symbol === inputOutputToken.symbol)
      .length > 0
  console.log(isAllowedCurrency)
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

  const from = await signer.getAddress()
  console.log(from, 'SIGNER')

  try {
    const request = {
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      slippage,
    }
    const quoteProvider = new FlashMintQuoteProvider(provider)
    const quoteFM = await quoteProvider.getQuote(request)
    console.log(quoteFM)
    if (quoteFM) {
      const { inputOutputAmount, tx } = quoteFM
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
        contract: quoteFM.contract,
        tx: transaction,
      }
    }
  } catch (e) {
    console.warn('Error fetching FlashMintQuote', e)
  }

  return null
}
