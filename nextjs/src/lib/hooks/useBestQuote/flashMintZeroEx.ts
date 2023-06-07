import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { getFlashMintZeroExQuote, ZeroExApi } from '@indexcoop/flash-mint-sdk'

import { MAINNET } from '@/constants/chains'
import { DefaultGasLimitFlashMintZeroEx } from '@/constants/gas'
import {
  Bitcoin2xFlexibleLeverageIndex,
  Ethereum2xFlexibleLeverageIndex,
  FIXED_DAI,
  FIXED_USDC,
  icETHIndex,
  IndexToken,
  Token,
} from '@/constants/tokens'
import { getFullCostsInUsd, getGasCostsInUsd } from '@/lib/utils/costs'
import { getFlashMintZeroExTransaction } from '@/lib/utils/flashMint/flashMintZeroExTransaction'
import { GasEstimatooor } from '@/lib/utils/gasEstimatooor'
import { TxSimulator } from '@/lib/utils/simulator'

import { ExchangeIssuanceZeroExQuote, QuoteType } from './'

export function isEligibleTradePairZeroEx(
  inputToken: Token,
  outputToken: Token
): boolean {
  if (
    inputToken.symbol === FIXED_DAI.symbol ||
    outputToken.symbol === FIXED_DAI.symbol
  )
    return false
  if (
    inputToken.symbol === FIXED_USDC.symbol ||
    outputToken.symbol === FIXED_USDC.symbol
  )
    return false
  if (
    inputToken.symbol === Bitcoin2xFlexibleLeverageIndex.symbol ||
    outputToken.symbol === Bitcoin2xFlexibleLeverageIndex.symbol
  )
    return false

  if (
    inputToken.symbol === Ethereum2xFlexibleLeverageIndex.symbol ||
    outputToken.symbol === Ethereum2xFlexibleLeverageIndex.symbol
  )
    return false

  if (
    inputToken.symbol === icETHIndex.symbol ||
    outputToken.symbol === icETHIndex.symbol
  )
    return false

  if (
    inputToken.symbol === IndexToken.symbol ||
    outputToken.symbol === IndexToken.symbol
  )
    return false

  return true
}

export async function getEnhancedFlashMintZeroExQuote(
  isMinting: boolean,
  inputTokenAddress: string,
  outputTokenAddress: string,
  inputTokenBalance: BigNumber,
  sellToken: Token,
  buyToken: Token,
  indexTokenAmount: BigNumber,
  sellTokenPrice: number,
  nativeTokenPrice: number,
  gasPrice: BigNumber,
  slippage: number,
  chainId: number,
  provider: JsonRpcProvider,
  zeroExApi: ZeroExApi,
  signer: any
): Promise<ExchangeIssuanceZeroExQuote | null> {
  // Allow trading only on mainnet and polygon (for deprecated/rebalanced tokens)
  if (chainId !== MAINNET.chainId && chainId !== 137) return null
  // For mainnet some tokens are disabled additionally
  const isEligibleTradePair = isEligibleTradePairZeroEx(sellToken, buyToken)
  if (!isEligibleTradePair) return null

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
    const quote0x = await getFlashMintZeroExQuote(
      inputToken,
      outputToken,
      indexTokenAmount,
      isMinting,
      slippage,
      zeroExApi,
      provider,
      chainId
    )
    if (quote0x) {
      const tx = await getFlashMintZeroExTransaction(
        isMinting,
        sellToken,
        buyToken,
        indexTokenAmount,
        quote0x.inputOutputTokenAmount,
        quote0x.componentQuotes,
        provider,
        signer,
        chainId
      )

      if (!tx) throw new Error('No transaction object')

      // if (req) {
      //   const accessKey = process.env.NEXT_PUBLIC_TENDERLY_ACCESS_KEY ?? ''
      //   const simulator = new TxSimulator(accessKey)
      //   await simulator.simulate(req)
      // }

      const defaultGasEstimate = BigNumber.from(DefaultGasLimitFlashMintZeroEx)
      const gasEstimatooor = new GasEstimatooor(signer, defaultGasEstimate)
      // We don't want this function to fail for estimates here.
      // A default will be returned if the tx would fail.
      const canFail = false
      const gasEstimate = await gasEstimatooor.estimate(tx, canFail)
      const gasCosts = gasEstimate.mul(gasPrice)
      const gasCostsInUsd = getGasCostsInUsd(gasCosts, nativeTokenPrice)
      return {
        type: QuoteType.exchangeIssuanceZeroEx,
        isMinting,
        inputToken: sellToken,
        outputToken: buyToken,
        gas: gasEstimate,
        gasPrice,
        gasCosts,
        gasCostsInUsd,
        fullCostsInUsd: getFullCostsInUsd(
          quote0x.inputOutputTokenAmount,
          gasEstimate.mul(gasPrice),
          sellToken.decimals,
          sellTokenPrice,
          nativeTokenPrice
        ),
        priceImpact: 0,
        indexTokenAmount,
        inputOutputTokenAmount: quote0x.inputOutputTokenAmount,
        // type specific properties
        componentQuotes: quote0x.componentQuotes,
      }
    }
  } catch (e) {
    console.warn('Error fetching FlashMintZeroEx quote', e)
  }

  return null
}
