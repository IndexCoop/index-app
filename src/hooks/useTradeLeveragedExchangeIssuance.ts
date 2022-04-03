import { useCallback, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, useEthers } from '@usedapp/core'

import {
  collateralDebtSwapData,
  debtCollateralSwapData,
  inputSwapData,
  outputSwapData,
} from 'constants/exchangeIssuanceLeveragedData'
import { ETH, MATIC, Token } from 'constants/tokens'
import { fromWei } from 'utils'

import { useExchangeIssuanceLeveraged } from './useExchangeIssuanceLeveraged'
import { useTokenBalance } from './useTokenBalance'

export const useTradeLeveragedExchangeIssuance = (
  isIssuance: boolean,
  inputToken: Token,
  outputToken: Token,
  // buy / sell token amount
  tokenAmout: BigNumber,
  // max input / min output
  inputOutputLimit: BigNumber
) => {
  const { account, chainId, library } = useEthers()
  const {
    issueExactSetFromETH,
    issueExactSetFromERC20,
    redeemExactSetForETH,
    redeemExactSetForERC20,
  } = useExchangeIssuanceLeveraged()

  const spendingTokenBalance = useTokenBalance(inputToken) || BigNumber.from(0)

  const [isTransactingLevEI, setIsTransacting] = useState(false)

  const executeLevEITrade = useCallback(async () => {
    if (!account || inputOutputLimit.isZero() || tokenAmout.isZero()) return

    const outputTokenAddress =
      chainId === ChainId.Polygon
        ? outputToken.polygonAddress
        : outputToken.address
    const inputTokenAddress =
      chainId === ChainId.Polygon
        ? inputToken.polygonAddress
        : inputToken.address
    if (!outputTokenAddress || !inputTokenAddress) return

    let requiredBalance = fromWei(inputOutputLimit, inputToken.decimals)
    if (spendingTokenBalance.lt(requiredBalance)) return

    try {
      setIsTransacting(true)
      if (isIssuance) {
        const amountOfSetToken = tokenAmout
        const isSellingNativeChainToken =
          inputToken.symbol === ETH.symbol || inputToken.symbol === MATIC.symbol

        console.log('inputswap', inputSwapData, 'token', inputTokenAddress)
        // TODO: make address selection dynamic
        const debtCollateralSwap =
          debtCollateralSwapData['0x3Ad707dA309f3845cd602059901E39C4dcd66473']
        const inputSwap =
          inputSwapData['0x3Ad707dA309f3845cd602059901E39C4dcd66473'][
            inputTokenAddress as keyof object
          ]

        if (isSellingNativeChainToken) {
          await issueExactSetFromETH(
            library,
            chainId,
            outputTokenAddress,
            amountOfSetToken,
            debtCollateralSwap,
            inputSwap,
            inputOutputLimit
          )
        } else {
          await issueExactSetFromERC20(
            library,
            chainId,
            outputTokenAddress,
            amountOfSetToken,
            inputTokenAddress,
            inputOutputLimit,
            debtCollateralSwap,
            inputSwap
          )
        }
      } else {
        const isRedeemingNativeChainToken =
          inputToken.symbol === ETH.symbol || inputToken.symbol === MATIC.symbol

        // TODO: make address selection dynamic
        const collateralDebtSwap =
          collateralDebtSwapData['0x7C07F7aBe10CE8e33DC6C5aD68FE033085256A84']
        const outputSwap =
          outputSwapData['0x7C07F7aBe10CE8e33DC6C5aD68FE033085256A84'][
            outputToken.address as keyof object
          ]

        if (isRedeemingNativeChainToken) {
          await redeemExactSetForETH(
            library,
            inputTokenAddress,
            tokenAmout,
            inputOutputLimit,
            collateralDebtSwap,
            outputSwap
          )
        } else {
          await redeemExactSetForERC20(
            library,
            inputTokenAddress,
            tokenAmout,
            outputTokenAddress,
            inputOutputLimit,
            collateralDebtSwap,
            outputSwap
          )
        }
      }
      setIsTransacting(false)
    } catch (error) {
      setIsTransacting(false)
      console.log('Error sending transaction', error)
    }
  }, [account, inputOutputLimit])

  return { executeLevEITrade, isTransactingLevEI }
}
