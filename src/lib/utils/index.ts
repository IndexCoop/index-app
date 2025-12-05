import {
  formatUnits,
  parseUnits as parseUnitsEthers,
} from '@ethersproject/units'
import {
  isAddress as isAddressViem,
  parseUnits as parseUnitsViem,
  PublicClient,
} from 'viem'
import { getCode } from 'viem/actions'

export function isAddress(address: string) {
  return isAddressViem(address)
}

export function isSameAddress(address1: string, address2: string): boolean {
  return address1.toLowerCase() === address2.toLowerCase()
}

export function shortenAddress(
  address: string,
  startLength: number = 6,
  endLength: number = 4,
): string {
  if (address.length < startLength + endLength) {
    throw new Error('Address is too short to be shortened.')
  }

  const shortenedStart = address.substring(0, startLength)
  const shortenedEnd = address.substring(address.length - endLength)

  return `${shortenedStart}...${shortenedEnd}`
}

export const formatAmount = (amount: number, digits: number = 2) =>
  amount.toLocaleString('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })

export const formatDollarAmount = (
  amount: number | null | undefined,
  hideZeroAmount: boolean = false,
  digits: number = 2,
  options: Intl.NumberFormatOptions = {},
) => {
  if (amount === null || amount === undefined) return ''
  if (amount === 0 && hideZeroAmount) return ''

  return Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    ...options,
  }).format(amount)
}

export function formatAmountFromWei(
  wei: bigint,
  units: number,
  digits: number = 2,
): string {
  const balanceAmount = formatWeiAsNumber(wei, units)
  return formatAmount(balanceAmount, digits)
}

export function formatWei(wei: bigint, units: number = 18): string {
  return formatUnits(wei, units)
}

function formatWeiAsNumber(
  wei: bigint | undefined,
  units: number = 18,
): number {
  if (wei === undefined) return 0
  return Number(formatUnits(wei, units))
}

export function parseUnits(value: string, units: number): bigint {
  return parseUnitsViem(value, units)
}

/**
 * Validate that the input amount is valid (positive, not excessive decimals)
 */
export const isValidTokenInput = (
  tokenAmount: string,
  tokenDecimals: number = 18,
) => {
  try {
    const parsedBn = parseUnitsEthers(tokenAmount, tokenDecimals)
    return !parsedBn.isNegative()
  } catch {
    return false
  }
}

export const isContract = async (client: PublicClient, address: string) => {
  const bytes = await getCode(client, { address: address as `0x${string}` })

  return bytes !== undefined
}
