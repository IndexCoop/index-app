import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { getFlashMintZeroExQuote, ZeroExApi } from '@indexcoop/flash-mint-sdk'

import { MAINNET } from 'constants/chains'
import {
  Bitcoin2xFlexibleLeverageIndex,
  Ethereum2xFlexibleLeverageIndex,
  FIXED_DAI,
  FIXED_USDC,
  icETHIndex,
  IndexToken,
  Token,
} from 'constants/tokens'
import { getFullCostsInUsd, getGasCostsInUsd } from 'utils/costs'
import { getFlashMintZeroExGasEstimate } from 'utils/flashMintZeroExGasEstimate'
import { getFlashMintZeroExTransaction } from 'utils/flashMintZeroExTransaction'
import { TxSimulator } from 'utils/simulator'

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
  if (chainId !== MAINNET.chainId) return null
  // For now only allow trade on mainnet, some tokens are disabled
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
    const spendingTokenBalance = inputTokenBalance
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
      const req = await getFlashMintZeroExTransaction(
        isMinting,
        sellToken,
        buyToken,
        indexTokenAmount,
        quote0x.inputOutputTokenAmount,
        inputTokenBalance,
        quote0x.componentQuotes,
        provider,
        signer,
        chainId
      )

      if (req) {
        const accessKey = process.env.REACT_APP_TENDERLY_ACCESS_KEY ?? ''
        const simulator = new TxSimulator(accessKey)
        await simulator.simulate(req)
      }

      // We don't want this function to fail for estimates here.
      // A default will be returned if the tx would fail.
      const canFail = false
      const gasEstimate = await getFlashMintZeroExGasEstimate(
        isMinting,
        sellToken,
        buyToken,
        indexTokenAmount,
        quote0x.inputOutputTokenAmount,
        spendingTokenBalance,
        quote0x.componentQuotes,
        provider,
        signer,
        chainId,
        canFail
      )
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
