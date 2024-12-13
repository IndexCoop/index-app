import { getTokenByChainAndAddress } from '@indexcoop/tokenlists'
import { Address, encodeFunctionData, PublicClient } from 'viem'

import { Issuance } from '@/app/legacy/config'
import { LegacyQuote } from '@/app/legacy/types'
import { POLYGON } from '@/constants/chains'
import { LeveragedRethStakingYield, RETH, Token } from '@/constants/tokens'
import { getTokenPrice } from '@/lib/hooks/use-token-price'
import { formatWei, isSameAddress } from '@/lib/utils'
import { getFullCostsInUsd } from '@/lib/utils/costs'
import { getGasLimit } from '@/lib/utils/gas'

import { Quote, QuoteTransaction, QuoteType } from '../../types'

import { DebtIssuanceModuleV2Abi } from './debt-issuance-module-v2-abi'
import { DebtIssuanceProvider } from './provider'

interface IssuanceQuoteRequest {
  chainId: number
  account: string
  inputToken: Token
  inputTokenAmount: bigint
  slippage: number
}

export async function getLegacyRedemptionQuote(
  request: IssuanceQuoteRequest,
  publicClient: PublicClient,
): Promise<{ extended: LegacyQuote; quote: Quote } | null> {
  const { account, chainId, inputToken, inputTokenAmount } = request

  if (inputTokenAmount <= 0) return null

  try {
    // Get issuance module contract
    const contract = Issuance[inputToken.symbol] as Address
    const debtIssuanceProvider = new DebtIssuanceProvider(
      contract,
      publicClient,
    )
    const [productComponents, units] =
      await debtIssuanceProvider.getComponentRedemptionUnits(
        inputToken.address! as Address,
        inputTokenAmount,
      )

    // hack to avoid obsolete components for polygon tokens
    const components =
      chainId === POLYGON.chainId ? [productComponents[0]] : productComponents

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
      chainId,
      from: account,
      to: contract,
      data: callData,
      value: undefined,
    }

    const defaultGasEstimate = BigInt(200_000)
    const { ethPrice, gas } = await getGasLimit(transaction, defaultGasEstimate)
    transaction.gas = gas.limit

    const inputTokenAmountUsd =
      parseFloat(formatWei(inputTokenAmount, inputToken.decimals)) *
      inputTokenPrice
    const outputTokenAmountUsdAfterFees = outputTokenAmountUsd - gas.costsUsd

    const fullCostsInUsd = getFullCostsInUsd(
      inputTokenAmount,
      gas.limit * gas.price,
      inputToken.decimals,
      inputTokenPrice,
      ethPrice,
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
        gas: gas.limit,
        gasPrice: gas.price,
        gasCosts: gas.costs,
        gasCostsInUsd: gas.costsUsd,
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
    console.warn('Error fetching legacy redemption quote', e)
    return null
  }
}
