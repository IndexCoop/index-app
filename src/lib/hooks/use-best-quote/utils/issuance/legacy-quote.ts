import {
  getIssuanceModule,
  IndexDebtIssuanceModuleV2Address_v2,
} from '@indexcoop/flash-mint-sdk'
import { getTokenDataByAddress } from '@indexcoop/tokenlists'
import { BigNumber } from 'ethers'
import { Address, encodeFunctionData, PublicClient } from 'viem'

import {
  BedIndex,
  LeveragedRethStakingYield,
  RealWorldAssetIndex,
  RETH,
  Token,
} from '@/constants/tokens'
import { getTokenPrice } from '@/lib/hooks/use-token-price'
import { formatWei, isSameAddress } from '@/lib/utils'
import { getFullCostsInUsd, getGasCostsInUsd } from '@/lib/utils/costs'
import { GasEstimatooor } from '@/lib/utils/gas-estimatooor'

import { Quote, QuoteTransaction, QuoteType } from '../../types'

import { DebtIssuanceModuleV2Abi } from './debt-issuance-module-v2-abi'
import { DebtIssuanceProvider } from './provider'

interface IssuanceQuoteRequest {
  account: string
  inputToken: Token
  inputTokenAmount: bigint
  gasPrice: bigint
  nativeTokenPrice: number
  slippage: number
}

export async function getLegacyRedemptionQuote(
  request: IssuanceQuoteRequest,
  publicClient: PublicClient,
): Promise<Quote | null> {
  const chainId = 1
  const { account, inputToken, inputTokenAmount, gasPrice, nativeTokenPrice } =
    request

  let contract = getIssuanceModule(inputToken.symbol, chainId)
    .address as Address
  if (
    BedIndex.symbol === inputToken.symbol ||
    LeveragedRethStakingYield.symbol === inputToken.symbol ||
    RealWorldAssetIndex.symbol === inputToken.symbol
  ) {
    contract = IndexDebtIssuanceModuleV2Address_v2
  }

  if (inputTokenAmount <= 0) return null

  try {
    const debtIssuanceProvider = new DebtIssuanceProvider(
      contract,
      publicClient,
    )
    const [components, units] =
      await debtIssuanceProvider.getComponentRedemptionUnits(
        inputToken.address! as Address,
        inputTokenAmount,
      )

    const isIcReth = isSameAddress(
      inputToken.address!,
      LeveragedRethStakingYield.address!,
    )
    const outputTokens = isIcReth
      ? [RETH]
      : components.map((component) => {
          const outputToken = getTokenDataByAddress(component, chainId)!
          return {
            ...outputToken,
            // all these properties below will be irrelevant for the legacy redemption
            image: outputToken.logoURI,
            coingeckoId: '',
            fees: { streamingFee: '0' },
            indexTypes: [],
            isDangerous: false,
            url: '',
          }
        })

    const inputTokenPrice = await getTokenPrice(inputToken, chainId)
    const outputTokenPricesPromises = outputTokens.map((outputToken) => {
      return getTokenPrice(outputToken, chainId)
    })
    const outputTokenPrices = await Promise.all(outputTokenPricesPromises)
    console.log(outputTokenPrices)
    // TODO:
    const outputTokenAmountUsd = outputTokenPrices.reduce(
      (total, price, index) => {
        console.log(
          total,
          price,
          Number(formatWei(units[index], outputTokens[index].decimals)),
          formatWei(units[index], outputTokens[index].decimals),
        )
        return (
          total +
          price * Number(formatWei(units[index], outputTokens[index].decimals))
        )
      },
      0,
    )
    console.log('USD', outputTokenAmountUsd)

    const callData = encodeFunctionData({
      abi: DebtIssuanceModuleV2Abi,
      functionName: 'redeem',
      args: [
        inputToken.address! as Address,
        inputTokenAmount,
        account as Address,
      ],
    })

    const transaction: QuoteTransaction = {
      account,
      chainId: 1,
      from: account,
      to: contract,
      data: callData,
      value: undefined,
    }

    const defaultGas = 200_000
    const defaultGasEstimate = BigInt(defaultGas)
    const gasEstimatooor = new GasEstimatooor(publicClient, defaultGasEstimate)
    const canFail = false
    const gasEstimate = await gasEstimatooor.estimate(transaction, canFail)
    const gasCosts = gasEstimate * gasPrice
    const gasCostsInUsd = getGasCostsInUsd(gasCosts, nativeTokenPrice)
    transaction.gasLimit = BigNumber.from(gasEstimate.toString())

    const inputTokenAmountUsd =
      parseFloat(formatWei(inputTokenAmount, inputToken.decimals)) *
      inputTokenPrice
    // TODO:
    // const outputTokenAmountUsd =
    //   parseFloat(formatWei(outputTokenAmount, inputToken.decimals)) *
    //   outputTokenPrice
    const outputTokenAmountUsdAfterFees = outputTokenAmountUsd - gasCostsInUsd

    const fullCostsInUsd = getFullCostsInUsd(
      inputTokenAmount,
      gasEstimate * gasPrice,
      inputToken.decimals,
      inputTokenPrice,
      nativeTokenPrice,
    )

    const outputTokenAmount = BigInt(0)

    return {
      type: QuoteType.issuance,
      chainId: 1,
      contract,
      isMinting: false,
      inputToken,
      outputToken: inputToken, // TODO:
      gas: BigNumber.from(gasEstimate.toString()),
      gasPrice: BigNumber.from(gasPrice.toString()),
      gasCosts: BigNumber.from(gasCosts.toString()),
      gasCostsInUsd,
      fullCostsInUsd,
      priceImpact: 0,
      indexTokenAmount: BigNumber.from(inputTokenAmount.toString()),
      inputOutputTokenAmount: BigNumber.from(outputTokenAmount.toString()),
      inputTokenAmount: BigNumber.from(inputTokenAmount.toString()),
      inputTokenAmountUsd,
      outputTokenAmount: BigNumber.from(outputTokenAmount.toString()),
      outputTokenAmountUsd,
      outputTokenAmountUsdAfterFees,
      inputTokenPrice,
      outputTokenPrice: 0,
      slippage: request.slippage,
      tx: transaction,
    }
  } catch (e) {
    console.warn('Error fetching issuance quote', e)
    return null
  }
}
