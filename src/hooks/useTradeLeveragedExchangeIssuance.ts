import { useCallback, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { useEthers } from '@usedapp/core'

import { POLYGON } from 'constants/chains'
import { ETH, MATIC, Token } from 'constants/tokens'
import { fromWei } from 'utils'
import { SwapData } from 'utils/exchangeIssuanceQuotes'

import { useBalance } from './useBalance'
import {
  getExchangeIssuanceLeveragedContract,
  useExchangeIssuanceLeveraged,
} from './useExchangeIssuanceLeveraged'

export const useTradeLeveragedExchangeIssuance = (
  isIssuance: boolean,
  inputToken: Token,
  outputToken: Token,
  // buy / sell token amount
  tokenAmout: BigNumber,
  // max input / min output
  inputOutputLimit: BigNumber,
  debtCollateralSwapData?: SwapData,
  inputOutputSwapData?: SwapData
) => {
  const { account, chainId, library } = useEthers()
  const {
    issueExactSetFromETH,
    issueExactSetFromERC20,
    redeemExactSetForETH,
    redeemExactSetForERC20,
  } = useExchangeIssuanceLeveraged()
  const { getBalance } = useBalance()

  const spendingTokenBalance =
    getBalance(inputToken.symbol) || BigNumber.from(0)

  const [isTransactingLevEI, setIsTransacting] = useState(false)

  const executeLevEITrade = useCallback(async () => {
    if (
      !account ||
      inputOutputLimit.isZero() ||
      tokenAmout.isZero() ||
      debtCollateralSwapData === undefined ||
      inputOutputSwapData === undefined
    )
      return

    const outputTokenAddress =
      chainId === POLYGON.chainId
        ? outputToken.polygonAddress
        : outputToken.address
    const inputTokenAddress =
      chainId === POLYGON.chainId
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

        if (isSellingNativeChainToken) {
          await issueExactSetFromETH(
            library,
            chainId,
            outputTokenAddress,
            amountOfSetToken,
            debtCollateralSwapData,
            inputOutputSwapData,
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
            debtCollateralSwapData,
            inputOutputSwapData
          )
        }
      } else {
        const isRedeemingToNativeChainToken =
          outputToken.symbol === ETH.symbol ||
          outputToken.symbol === MATIC.symbol

        const contract = await getExchangeIssuanceLeveragedContract(
          library?.getSigner(),
          chainId
        )

        if (isRedeemingToNativeChainToken) {
          await redeemExactSetForETH(
            contract,
            inputTokenAddress,
            tokenAmout,
            inputOutputLimit,
            debtCollateralSwapData,
            inputOutputSwapData
          )
        } else {
          await redeemExactSetForERC20(
            contract,
            inputTokenAddress,
            tokenAmout,
            outputTokenAddress,
            inputOutputLimit,
            debtCollateralSwapData,
            inputOutputSwapData
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
