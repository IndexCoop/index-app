import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits, parseEther } from '@ethersproject/units'

export const selectLatestMarketData = (marketData?: number[][]) =>
  marketData?.[marketData.length - 1]?.[1] || 0

/**
 * Converts a number to Wei to another denomination of Eth
 * @param number
 * @param power default = 18
 * @returns
 */
export const toWei = (
  value: number | string,
  power: number = 18
): BigNumber => {
  if (typeof value === 'number') {
    return parseEther(value.toString()).mul(BigNumber.from(10).pow(18 - power))
  }
  return parseEther(value).mul(BigNumber.from(10).pow(18 - power))
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

/**
 * Formats a BigNumber to 2 decimals from Wei
 * @param number
 * @returns
 */
export const displayFromWei = (
  number: BigNumber | undefined,
  decimals: number = 2
): string => {
  if (!number) return ''
  return Number(formatUnits(number)).toFixed(decimals)
}

export const preciseMul = (a: BigNumber, b: BigNumber): BigNumber => {
  return a.mul(b).div(toWei(1))
}

export const preciseDiv = (a: BigNumber, b: BigNumber): BigNumber => {
  if (b.isZero()) return BigNumber.from(0)
  return a.mul(toWei(1)).div(b)
}
