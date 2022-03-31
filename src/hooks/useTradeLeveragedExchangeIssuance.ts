import { useCallback, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, useEthers } from '@usedapp/core'

import { ETH, MATIC, Token } from 'constants/tokens'
import { fromWei } from 'utils'

import { useExchangeIssuanceLeveraged } from './useExchangeIssuanceLeveraged'
import { useTokenBalance } from './useTokenBalance'
import { collateralDebtSwapData, debtCollateralSwapData, inputSwapData, outputSwapData } from 'constants/exchangeIssuanceLeveragedData'

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
    if (!account || !inputOutputLimit) return

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
      inputOutputLimit,
      inputToken.decimals
    )
    if (spendingTokenBalance.lt(requiredBalance)) return

    try {
      setIsTransacting(true)
      if (isIssuance) {
        const amountOfSetToken = tokenAmout
        const isSellingNativeChainToken =
          inputToken.symbol === ETH.symbol || inputToken.symbol === MATIC.symbol

        const debtCollateralSwap = debtCollateralSwapData[outputToken.symbol as keyof Object];
        const inputSwap = inputSwapData[outputToken.symbol as keyof Object][inputToken.symbol as keyof object];

        if (isSellingNativeChainToken) {
          await issueExactSetFromETH(
            library,
            outputTokenAddress,
            amountOfSetToken,
            debtCollateralSwap,
            inputSwap,
            inputOutputLimit,            
          )
        } else {
          await issueExactSetFromERC20(
            library,
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
        
        const collateralDebtSwap = collateralDebtSwapData[inputToken.symbol as keyof Object];
        const outputSwap = outputSwapData[inputToken.symbol as keyof Object][outputToken.symbol as keyof object];

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
          );
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
