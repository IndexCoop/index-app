import { BigNumber } from 'ethers'
import JSBI from 'jsbi'

import { getPolygonSdk } from '@dethcrypto/eth-sdk-client'
import { CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core'
import { AlphaRouter } from '@uniswap/smart-order-router'

export async function getTokenPathAndFees(
  router: AlphaRouter,
  amountRaw: string,
  tokenIn: Token,
  tokenOut: Token,
  signer: any,
  isExactInput: boolean = true,
  slippageTolerance: number = 5
) {
  const polygonSdk = getPolygonSdk(signer)

  let route
  if (isExactInput) {
    const amountIn = CurrencyAmount.fromRawAmount(
      tokenIn,
      JSBI.BigInt(amountRaw)
    )
    const swapOptions = {
      recipient: signer.address,
      slippageTolerance: new Percent(slippageTolerance, 100),
      deadline: Date.now() + 1800,
    }
    route = await router.route(
      amountIn,
      tokenOut,
      TradeType.EXACT_INPUT,
      swapOptions,
      { maxSplits: 1 }
    )
  } else {
    const amountOut = CurrencyAmount.fromRawAmount(
      tokenOut,
      JSBI.BigInt(amountRaw)
    )
    route = await router.route(
      amountOut,
      tokenIn,
      TradeType.EXACT_OUTPUT,
      {
        recipient: signer.address,
        slippageTolerance: new Percent(slippageTolerance, 100),
        deadline: Date.now() + 1800,
      },
      { maxSplits: 1 }
    )
  }

  const path: string[] =
    route?.route[0].tokenPath.map((token) => token.address) ?? []
  const feePromises = route?.route[0].poolAddresses.map(async (poolAddress) => {
    const contract = polygonSdk.uniswap.v3.pool.attach(poolAddress)
    const fee = await contract.fee()
    return fee
  })
  let fees: number[] = []
  if (feePromises !== undefined) {
    fees = await Promise.all(feePromises)
  }
  return { path, fees }
}

export async function getSwapData(
  router: AlphaRouter,
  debtAmount: BigNumber,
  inputToken: any,
  outputToken: any,
  signer: any,
  isExactInput: boolean = true
) {
  const inputTokenData = await getTokenData(inputToken)
  const outputTokenData = await getTokenData(outputToken)

  return getTokenPathAndFees(
    router,
    debtAmount.toString(),
    inputTokenData,
    outputTokenData,
    signer,
    isExactInput
  )
}

async function getTokenData(token: any) {
  return new Token(
    137,
    token.address,
    await token.decimals(),
    await token.symbol(),
    await token.name()
  )
}
