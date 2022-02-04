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
export const fromWei = (number?: BigNumber, power: number = 18): BigNumber => {
  if (!number) return BigNumber.from(0)
  return number.div(BigNumber.from(10).pow(power))
}

/**
 * Formats a BigNumber from Wei
 * @param decimals round to decimals is NOT precise
 * @param power default to 18 covers most token decimals
 */
export const displayFromWei = (
  number: BigNumber | undefined,
  decimals: number = 0,
  power: number = 18
): string => {
  if (!number) return ''

  if (decimals) {
    return Number(formatUnits(number)).toFixed(decimals)
  }

  return formatUnits(number, power)
}

export const preciseMul = (a: BigNumber, b: BigNumber): BigNumber => {
  return a.mul(b).div(toWei(1))
}

export const preciseDiv = (a: BigNumber, b: BigNumber): BigNumber => {
  if (b.isZero()) return BigNumber.from(0)
  return a.mul(toWei(1)).div(b)
}
