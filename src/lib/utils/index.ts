import { BigNumber } from 'ethers'

import { formatUnits, parseUnits } from '@ethersproject/units'

export function isSameAddress(address1: string, address2: string): boolean {
  return address1.toLowerCase() === address2.toLowerCase()
}

export const selectLatestMarketData = (marketData?: number[][]) =>
  marketData?.[marketData.length - 1]?.[1] || 0

export function shortenAddress(
  address: string,
  startLength: number = 6,
  endLength: number = 4
): string {
  if (address.length < startLength + endLength) {
    throw new Error('Address is too short to be shortened.')
  }

  const shortenedStart = address.substring(0, startLength)
  const shortenedEnd = address.substring(address.length - endLength)

  return `${shortenedStart}...${shortenedEnd}`
}

/**
 * Converts a number to Wei to another denomination of Eth.
 * Note: will loose precision if fraction part is greater than the decimals.
 * @param valueToConvert
 * @param power default = 18
 * @returns converted number as BigNumber
 */
export const toWei = (
  valueToConvert: number | string,
  power: number = 18
): BigNumber => {
  // parseUnits only accepts strings
  let value =
    typeof valueToConvert === 'number'
      ? valueToConvert.toString()
      : valueToConvert

  const splits = value.split('.')
  const integerPart = splits[0]
  let fractionalPart = splits[1]

  if (!fractionalPart) {
    return parseUnits(integerPart, power)
  }

  if (fractionalPart.length > power) {
    // Fractional components must not exceed decimals
    fractionalPart = fractionalPart.substring(0, power)
  }

  value = integerPart + '.' + fractionalPart
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
