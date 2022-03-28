import { useCallback, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, useEthers } from '@usedapp/core'

import { ETH, MATIC, Token } from 'constants/tokens'
import { fromWei } from 'utils'
import { Exchange, LeveragedExchangeIssuanceQuote } from 'utils/exchangeIssuanceQuotes'
import { getIssuanceModule } from 'utils/issuanceModule'

import { useExchangeIssuanceLeveraged } from './useExchangeIssuanceLeveraged'
import { useTokenBalance } from './useTokenBalance'

export const useTradeLeveragedExchangeIssuance = (
    isIssuance: boolean,
    inputToken: Token,
    outputToken: Token,
    // buy token amount
    tokenAmout: BigNumber,
    quoteData?: LeveragedExchangeIssuanceQuote | null
) => {
    const { account, chainId, library } = useEthers()
    const {
        issueExactSetFromETH,
        issueExactSetFromERC20,
        redeemExactSetForETH,
        redeemExactSetForERC20,
    } = useExchangeIssuanceLeveraged()

    const tokenSymbol = isIssuance ? outputToken.symbol : inputToken.symbol
    const issuanceModule = getIssuanceModule(tokenSymbol, chainId)
    const spendingTokenBalance =
        useTokenBalance(inputToken) || BigNumber.from(0)

    const [isTransactingLevEI, setIsTransacting] = useState(false)

    const executeLevEITrade = useCallback(async () => {
        if (!account || !quoteData) return

        const outputTokenAddress =
            chainId === ChainId.Polygon
                ? outputToken.polygonAddress
                : outputToken.address
        const inputTokenAddress =
            chainId === ChainId.Polygon
                ? inputToken.polygonAddress
                : inputToken.address
        if (!outputTokenAddress || !inputTokenAddress) return

        let requiredBalance = fromWei(
            quoteData.inputTokenAmount,
            inputToken.decimals
        )
        if (spendingTokenBalance.lt(requiredBalance)) return

        console.log(quoteData.inputTokenAmount.toString())

        try {
            setIsTransacting(true)
            if (isIssuance) {
                const amountOfSetToken = tokenAmout
                const isSellingNativeChainToken =
                    inputToken.symbol === ETH.symbol ||
                    inputToken.symbol === MATIC.symbol

                if (isSellingNativeChainToken) {
                    await issueExactSetFromETH(
                        library,
                        outputTokenAddress,
                        amountOfSetToken,
                        // TODO: add best exhange
                        Exchange.UniV3,
                        // TODO: add swap data debt collertal
                        issuanceModule.address,
                        // TODO: add swap data input token
                        issuanceModule.isDebtIssuance
                    )
                } else {
                    const maxAmountInputToken = quoteData.inputTokenAmount
                    // TODO: pass correct params
                    // await issueExactSetFromToken(
                    //   library,
                    //   outputTokenAddress,
                    //   inputTokenAddress,
                    //   amountOfSetToken,
                    //   maxAmountInputToken,
                    //   quoteData.tradeData,
                    //   issuanceModule.address,
                    //   issuanceModule.isDebtIssuance
                    // )
                }
            } else {
                const isRedeemingNativeChainToken =
                    inputToken.symbol === ETH.symbol ||
                    inputToken.symbol === MATIC.symbol
                const minAmountToReceive = tokenAmout

                if (isRedeemingNativeChainToken) {
                    // TODO: pass correct params
                    // await redeemExactSetForETH(
                    //   library,
                    //   inputTokenAddress,
                    //   minAmountToReceive,
                    //   quoteData.tradeData,
                    //   issuanceModule.address,
                    //   issuanceModule.isDebtIssuance
                    // )
                } else {
                    // TODO: pass correct params
                    // await redeemExactSetForToken(
                    //   library,
                    //   inputTokenAddress,
                    //   outputTokenAddress,
                    //   requiredBalance,
                    //   minAmountToReceive,
                    //   quoteData.tradeData,
                    //   issuanceModule.address,
                    //   issuanceModule.isDebtIssuance
                    // )
                }
            }
            setIsTransacting(false)
        } catch (error) {
            setIsTransacting(false)
            console.log('Error sending transaction', error)
        }
    }, [account, quoteData])

    return { executeLevEITrade, isTransactingLevEI }
}
