import { BigNumber, ethers } from 'ethers'

import { ChainId } from '@usedapp/core'

import { Token } from 'constants/tokens'
import {
    getRequiredIssuanceComponents,
    getRequiredRedemptionComponents,
} from 'hooks/useExchangeIssuanceZeroEx'
import { displayFromWei, toWei } from 'utils'
import { getIssuanceModule } from 'utils/issuanceModule'
import { get0xQuote } from 'utils/zeroExUtils'

export interface ExchangeIssuanceQuote {
    tradeData: string[]
    inputTokenAmount: BigNumber
}

export interface LeveragedExchangeIssuanceQuote {
    swapDataDebtCollateral: SwapData
    swapDataPaymentToken: SwapData
    inputTokenAmount: BigNumber
}

export enum Exchange {
    None,
    Quickswap,
    Sushiswap,
    UniV3,
    Curve,
}
export interface SwapData {
    exchange: Exchange
    path: string[]
    fees: number[]
    pool: string
}

/**
 * Returns exchange issuance quotes (incl. 0x trade data) or null
 *
 * @param buyToken            The token to buy
 * @param buyTokenAmount      The amount of buy token that should be acquired
 * @param sellToken           The sell token
 * @param chainId             ID for current chain
 * @param library             Web3Provider instance
 *
 * @return tradeData           Array of 0x trade data for the individual positions
 * @return inputTokenAmount    Needed input token amount for trade
 */
export const getExchangeIssuanceQuotes = async (
    buyToken: Token,
    buyTokenAmount: BigNumber,
    sellToken: Token,
    isIssuance: boolean,
    chainId: ChainId = ChainId.Mainnet,
    library: ethers.providers.Web3Provider | undefined
): Promise<ExchangeIssuanceQuote | null> => {
    const tokenSymbol = isIssuance ? buyToken.symbol : sellToken.symbol
    const issuanceModule = getIssuanceModule(tokenSymbol, chainId)
    console.log('Getting issuance quotes')
    console.log(
        'fetching...',
        buyTokenAmount.toString(),
        buyToken.symbol,
        buyToken.address,
        issuanceModule
    )

    const { components, positions } = isIssuance
        ? await getRequiredIssuanceComponents(
              library,
              issuanceModule.address,
              issuanceModule.isDebtIssuance,
              buyToken.address!,
              buyTokenAmount
          )
        : await getRequiredRedemptionComponents(
              library,
              issuanceModule.address,
              issuanceModule.isDebtIssuance,
              sellToken.address!,
              buyTokenAmount
          )

    let positionQuotes: string[] = []
    let inputTokenAmount = BigNumber.from(0)
    // Slippage hard coded to .5% (will be increased if there are revert issues)
    const slippagePercents = 0.5
    // 0xAPI expects percentage as value between 0-1 e.g. 5% -> 0.05
    const slippagePercentage = slippagePercents / 100

    const quotePromises: Promise<any>[] = []
    components.forEach((component, index) => {
        console.log('\n\n###################COMPONENT QUOTE##################')
        const buyAmount = positions[index]
        const buyTokenAddress = component
        const sellTokenAddress =
            sellToken.symbol === 'ETH' ? 'ETH' : sellToken.address
        console.log(
            'buyToken:',
            buyTokenAddress,
            'sellToken:',
            sellTokenAddress
        )
        console.log(
            'buyAmount:',
            buyAmount.toString(),
            buyAmount.div(BigNumber.from(10).pow(18)).toString()
        )
        if (buyTokenAddress === sellTokenAddress) {
            console.log(
                'Component equal to input token skipping zero ex api call'
            )
            inputTokenAmount = inputTokenAmount.add(buyAmount)
        } else {
            const quotePromise = get0xQuote(
                {
                    buyToken: buyTokenAddress,
                    sellToken: sellTokenAddress,
                    buyAmount: buyAmount.toString(),
                    slippagePercentage,
                },
                chainId ?? 1
            )
            quotePromises.push(quotePromise)
        }
    })

    const results = await Promise.all(quotePromises)
    if (results.length < 1) return null

    positionQuotes = results.map((result) => result.data)
    inputTokenAmount = results
        .map((result) => BigNumber.from(result.sellAmount))
        .reduce((prevValue, currValue) => {
            return currValue.add(prevValue)
        })

    console.log('//////////')
    console.log('quotes', positionQuotes)
    console.log(inputTokenAmount.toString())
    console.log(
        displayFromWei(inputTokenAmount, 2, sellToken.decimals),
        sellToken.decimals
    )

    // Christn: I assume that this is the correct math to make sure we have enough weth to cover the slippage
    // based on the fact that the slippagePercentage is limited between 0.0 and 1.0 on the 0xApi
    inputTokenAmount = inputTokenAmount
        .mul(toWei(100, sellToken.decimals))
        .div(toWei(100 - slippagePercents, sellToken.decimals))
    console.log(
        displayFromWei(inputTokenAmount, 2, sellToken.decimals),
        sellToken.decimals
    )

    return { tradeData: positionQuotes, inputTokenAmount }
}

export const getLeveragedExchangeIssuanceQuotes = async (
    buyToken: Token,
    buyTokenAmount: BigNumber,
    sellToken: Token,
    isIssuance: boolean,
    chainId: ChainId = ChainId.Mainnet,
    library: ethers.providers.Web3Provider | undefined
): Promise<LeveragedExchangeIssuanceQuote | null> => {
    const tokenSymbol = isIssuance ? buyToken.symbol : sellToken.symbol
    const issuanceModule = getIssuanceModule(tokenSymbol, chainId)
    console.log('Getting issuance quotes')
    console.log(
        'fetching...',
        buyTokenAmount.toString(),
        buyToken.symbol,
        buyToken.address,
        issuanceModule
    )

    // TODO: Dummy data replace with actual logic
    const swapDataDebtCollateral = {
        exchange: Exchange.Sushiswap,
        path: [
            '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
            '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        ],
        fees: [300, 300],
        pool: '0x0000000000000000000000000000000000000000',
    }

    const swapDataPaymentToken = {
        exchange: Exchange.Sushiswap,
        path: [
            '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
            '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        ],
        fees: [300, 300],
        pool: '0x0000000000000000000000000000000000000000',
    }

    const inputTokenAmount = buyTokenAmount.mul(10);

    return { swapDataDebtCollateral, swapDataPaymentToken, inputTokenAmount }
}
