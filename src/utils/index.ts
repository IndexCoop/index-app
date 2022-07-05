import { BigNumber } from 'ethers'

import { formatUnits, parseUnits } from '@ethersproject/units'

import { SUPPORTED_CHAINS } from 'constants/chains'

export const selectLatestMarketData = (marketData?: number[][]) =>
  marketData?.[marketData.length - 1]?.[1] || 0

/**
 * Converts a number to Wei to another denomination of Eth
 * @param value
 * @param power default = 18
 * @returns
 */
export const toWei = (
  value: number | string,
  power: number = 18
): BigNumber => {
  if (typeof value === 'number') {
    return parseUnits(value.toString(), power)
  }
  return parseUnits(value, power)
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
): string | null => {
  if (!number) return null

  if (decimals) {
    return Number(formatUnits(number, power)).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: false,
    })
  }

  return formatUnits(number, power).toLocaleString()
}

/**
 * Validate that the input amount is valid (positive, not excessive decimals)
 */
export const isValidTokenInput = (
  tokenAmount: string,
  tokenDecimals: number = 18
) => {
  try {
    const parsedBn = parseUnits(tokenAmount, tokenDecimals)
    return !parsedBn.isNegative()
  } catch {
    return false
  }
}

export const safeDiv = (dividend: BigNumber, divisor: BigNumber): BigNumber => {
  if (divisor.isZero()) return BigNumber.from(0)
  return dividend.div(divisor)
}

/**
 * Returns whether the chain(id) is supported
 * @param chainId
 * @returns boolean if chain with given id is supported.
 */
export function isSupportedNetwork(chainId: number): boolean {
  const supportedNetwork = SUPPORTED_CHAINS.filter(
    (chain) => chain.chainId === chainId
  )
  return supportedNetwork.length > 0
}
