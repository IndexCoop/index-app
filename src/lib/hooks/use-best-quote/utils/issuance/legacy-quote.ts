import {
  getTokenByChainAndAddress,
  getTokenByChainAndSymbol,
} from '@indexcoop/tokenlists'
import { type Address, type PublicClient, encodeFunctionData } from 'viem'

import { Issuance } from '@/app/legacy/config'
import { LeveragedRethStakingYield } from '@/app/legacy/config/tokens/mainnet'
import { MAINNET, POLYGON } from '@/constants/chains'
import { RETH, type Token } from '@/constants/tokens'
import { formatWei, isSameAddress } from '@/lib/utils'
import { getFullCostsInUsd } from '@/lib/utils/costs'
import { getGasLimit } from '@/lib/utils/gas'
import { getTokenPrice } from '@/lib/utils/token-price'

import { type Quote, type QuoteTransaction, QuoteType } from '../../types'

import { DebtIssuanceModuleV2Abi } from './debt-issuance-module-v2-abi'
import { FliRedemptionHelperAbi } from './fli-redemption-helper-abi'
import { DebtIssuanceProvider } from './provider'

import type { LegacyQuote } from '@/app/legacy/types'

const FLI_REDEMPTION_CONFIG: Record<
  string,
  { helper: Address; outputSymbol: string }
> = {
  'ETH2x-FLI': {
    helper: '0x5Efda1DBD6ADcEe04CF8Bd6599af3D9b2c8Fc85f',
    outputSymbol: 'ETH2X',
  },
  'BTC2x-FLI': {
    helper: '0xD7937c7cbE8BE535d536f8BEF0c301651E400852',
    outputSymbol: 'BTC2X',
  },
}

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

  const fliConfig = FLI_REDEMPTION_CONFIG[inputToken.symbol]
  if (fliConfig && chainId === MAINNET.chainId) {
    return getFliRedemptionQuote(request, publicClient, fliConfig)
  }

  try {
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
      from: account as `0x${string}`,
      to: contract,
      data: callData,
      value: undefined,
    }

    const defaultGasEstimate = BigInt(200_000)
    const { ethPrice, gas } = await getGasLimit(
      transaction,
      defaultGasEstimate,
      publicClient,
    )
    transaction.gas = gas.limit

    const inputTokenAmountUsd =
      Number.parseFloat(formatWei(inputTokenAmount, inputToken.decimals)) *
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
        indexTokenAmount: inputTokenAmount,
        inputOutputTokenAmount: outputTokenAmount,
        inputTokenAmount,
        inputTokenAmountUsd,
        outputTokenAmount,
        outputTokenAmountUsd,
        outputTokenAmountUsdAfterFees,
        quoteAmount: BigInt(0), // unused for legacy redemption quotes
        quoteAmountUsd: 0, // unused for legacy redemption quotes
        inputTokenPrice,
        outputTokenPrice: outputTokenPrices[0],
        slippage: request.slippage,
        fees: {
          mint: 0,
          redeem: 0,
          streaming: 0,
        },
        tx: transaction,
      },
    }
  } catch (e) {
    console.warn('Error fetching legacy redemption quote', e)
    return null
  }
}

async function getFliRedemptionQuote(
  request: IssuanceQuoteRequest,
  publicClient: PublicClient,
  fliConfig: { helper: Address; outputSymbol: string },
): Promise<{ extended: LegacyQuote; quote: Quote } | null> {
  const { account, chainId, inputToken, inputTokenAmount } = request

  try {
    const outputTokenData = getTokenByChainAndSymbol(
      chainId,
      fliConfig.outputSymbol,
    )
    if (!outputTokenData) return null

    const outputToken = {
      ...outputTokenData,
      image: outputTokenData.logoURI,
    }

    const outputAmount = await publicClient.readContract({
      address: fliConfig.helper,
      abi: FliRedemptionHelperAbi,
      functionName: 'getNestedTokenReceivedOnRedemption',
      args: [inputTokenAmount],
    })

    const inputTokenPrice = await getTokenPrice(inputToken, chainId)
    const outputTokenPrice = await getTokenPrice(outputToken, chainId)

    const inputTokenAmountUsd =
      Number.parseFloat(formatWei(inputTokenAmount, inputToken.decimals)) *
      inputTokenPrice
    const outputTokenAmountUsd =
      Number.parseFloat(formatWei(outputAmount, outputToken.decimals)) *
      outputTokenPrice

    const callData = encodeFunctionData({
      abi: FliRedemptionHelperAbi,
      functionName: 'redeem',
      args: [inputTokenAmount, account as Address],
    })

    const transaction: QuoteTransaction = {
      account,
      chainId,
      from: account as `0x${string}`,
      to: fliConfig.helper,
      data: callData,
      value: undefined,
    }

    const defaultGasEstimate = BigInt(500_000)
    const { ethPrice, gas } = await getGasLimit(
      transaction,
      defaultGasEstimate,
      publicClient,
    )
    transaction.gas = gas.limit

    const outputTokenAmountUsdAfterFees = outputTokenAmountUsd - gas.costsUsd

    const fullCostsInUsd = getFullCostsInUsd(
      inputTokenAmount,
      gas.limit * gas.price,
      inputToken.decimals,
      inputTokenPrice,
      ethPrice,
    )

    return {
      extended: {
        components: [outputToken.address as Address],
        outputTokens: [outputToken],
        outputTokenPricesUsd: [outputTokenAmountUsd],
        units: [outputAmount],
      },
      quote: {
        type: QuoteType.issuance,
        chainId,
        contract: fliConfig.helper,
        isMinting: false,
        inputToken,
        outputToken,
        gas: gas.limit,
        gasPrice: gas.price,
        gasCosts: gas.costs,
        gasCostsInUsd: gas.costsUsd,
        fullCostsInUsd,
        indexTokenAmount: inputTokenAmount,
        inputOutputTokenAmount: outputAmount,
        inputTokenAmount,
        inputTokenAmountUsd,
        outputTokenAmount: outputAmount,
        outputTokenAmountUsd,
        outputTokenAmountUsdAfterFees,
        quoteAmount: outputAmount,
        quoteAmountUsd: outputTokenAmountUsd,
        inputTokenPrice,
        outputTokenPrice,
        slippage: request.slippage,
        fees: {
          mint: 0,
          redeem: 0,
          streaming: 0,
        },
        tx: transaction,
      },
    }
  } catch (e) {
    console.warn('Error fetching FLI redemption quote', e)
    return null
  }
}
