import { BigNumber } from '@ethersproject/bignumber'
import { parseEther } from '@ethersproject/units'

export const selectLatestMarketData = (marketData?: number[][]) =>
  marketData?.[marketData.length - 1]?.[1] || 0

/**
 * Converts a number to Wei to another denomination of Eth
 * @param number
 * @param power default = 18
 * @returns
 */
export const toWei = (number: number, power: number = 18): BigNumber => {
  return parseEther(number.toString()).mul(BigNumber.from(10).pow(18 -  power))
}

/**
 * Converts a number from Wei to another denomination of Eth
 * @param number
 * @param power default = 18
 * @returns
 */
export const fromWei = (number: BigNumber, power: number = 18): BigNumber => {
  return number.div(BigNumber.from(10).pow(power))
}

export const preciseMul = (a: BigNumber, b: BigNumber): BigNumber => {
  return a.mul(b).div(toWei(1))
}

export const preciseDiv = (a: BigNumber, b: BigNumber): BigNumber => {
  return a.mul(toWei(1)).div(b)
}
