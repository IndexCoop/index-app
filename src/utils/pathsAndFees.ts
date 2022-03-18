import { BigNumber } from '@ethersproject/bignumber'

import { displayFromWei, getChainAddress, toWei } from 'utils'
import { get0xApiParams, get0xQuote } from 'utils/zeroExUtils'

export async function getTokenPathAndFees(
  amount: BigNumber,
  tokenIn: string,
  tokenOut: string,
  isExactInput: boolean = true,
  // TODO:
  slippageTolerance: number = 3
) {
  // TODO: check if fees correct
  const flashloanFees = BigNumber.from(amount).mul(toWei(9).div(toWei(10000)))
  const buySellAmount = BigNumber.from(amount).add(flashloanFees)

  // TODO: check decimals (for USDC)
  const params = get0xApiParams(
    isExactInput,
    tokenIn,
    18,
    tokenOut,
    18,
    buySellAmount.toString()
  )
  const response = await get0xQuote(params, 137)

  console.log('//////////////////////////')
  console.log(params)
  console.log(response)
  console.log('///')

  // const path: string[] =
  //   route?.route[0].tokenPath.map((token) => token.address) ?? []
  // const feePromises = route?.route[0].poolAddresses.map(async (poolAddress) => {
  //   const contract = polygonSdk.uniswap.v3.pool.attach(poolAddress)
  //   const fee = await contract.fee()
  //   return fee
  // })
  // let fees: number[] = []
  // if (feePromises !== undefined) {
  //   fees = await Promise.all(feePromises)
  // }

  // TODO: return buyAmount as well?
  const path: string[] = []
  const fees: BigNumber[] = []
  return { path, fees }
}
