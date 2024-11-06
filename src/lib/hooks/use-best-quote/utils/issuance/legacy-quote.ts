import { getTokenByChainAndAddress } from '@indexcoop/tokenlists'
import { Address, encodeFunctionData, PublicClient } from 'viem'

import { Issuance } from '@/app/legacy/config'
import { LegacyQuote } from '@/app/legacy/types'
import { LeveragedRethStakingYield, RETH, Token } from '@/constants/tokens'
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
): Promise<{ extended: LegacyQuote; quote: Quote } | null> {
  const chainId = 1
  const { account, inputToken, inputTokenAmount, gasPrice, nativeTokenPrice } =
    request

  if (inputTokenAmount <= 0) return null

  try {
    // Get issuance module contract
    const contract = Issuance[inputToken.symbol] as Address
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
          const outputToken = getTokenByChainAndAddress(chainId, component)!
          return {
            ...outputToken,
            image: outputToken.logoURI,
            // all these properties below will be irrelevant for the legacy redemption
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
    const outputTokenPricesUsd = outputTokenPrices.map(
      (price, index) =>
        price * Number(formatWei(units[index], outputTokens[index].decimals)),
    )
    const outputTokenAmountUsd = outputTokenPricesUsd.reduce((total, price) => {
      return total + price
    }, 0)

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
    transaction.gas = gasEstimate

    const inputTokenAmountUsd =
      parseFloat(formatWei(inputTokenAmount, inputToken.decimals)) *
      inputTokenPrice
    const outputTokenAmountUsdAfterFees = outputTokenAmountUsd - gasCostsInUsd

    const fullCostsInUsd = getFullCostsInUsd(
      inputTokenAmount,
      gasEstimate * gasPrice,
      inputToken.decimals,
      inputTokenPrice,
      nativeTokenPrice,
    )

    const isMultiComponentRedemption = components.length > 1 && !isIcReth
    const outputTokenAmount = isMultiComponentRedemption ? BigInt(0) : units[0]

    return {
      extended: {
        components: [...components],
        outputTokens,
        outputTokenPricesUsd,
        units: [...units],
      },
      quote: {
        type: QuoteType.issuance,
        chainId,
        contract,
        isMinting: false,
        inputToken,
        outputToken: outputTokens[0], // used only in tx review modal
        gas: gasEstimate,
        gasPrice,
        gasCosts,
        gasCostsInUsd,
        fullCostsInUsd,
        priceImpact: 0,
        indexTokenAmount: inputTokenAmount,
        inputOutputTokenAmount: outputTokenAmount,
        inputTokenAmount,
        inputTokenAmountUsd,
        outputTokenAmount,
        outputTokenAmountUsd,
        outputTokenAmountUsdAfterFees,
        inputTokenPrice,
        outputTokenPrice: outputTokenPrices[0],
        slippage: request.slippage,
        tx: transaction,
      },
    }
  } catch (e) {
    console.warn('Error fetching issuance quote', e)
    return null
  }
}
