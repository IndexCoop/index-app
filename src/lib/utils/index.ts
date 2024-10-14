import {
  formatUnits,
  parseUnits as parseUnitsEthers,
} from '@ethersproject/units'
import { ListedToken } from '@nsorcell/exp-tokenlist'
import {
  isAddress as isAddressViem,
  parseUnits as parseUnitsViem,
  PublicClient,
} from 'viem'
import { getCode } from 'viem/actions'

import { Token } from '@/constants/tokens'

export function isAddress(address: string) {
  return isAddressViem(address)
}

export function isSameAddress(address1: string, address2: string): boolean {
  return address1.toLowerCase() === address2.toLowerCase()
}

// TODO: Settle on one token typing approach?
export const formatTokenDataToToken = (tokenData: ListedToken): Token => {
  return {
    address: tokenData.address,
    name: tokenData.name,
    decimals: tokenData.decimals,
    symbol: tokenData.symbol,
    image: tokenData.logoURI,
    indexTypes: [],
    isDangerous: true,
    coingeckoId: '',
    url: '',
    arbitrumAddress: undefined,
    optimismAddress: undefined,
    polygonAddress: undefined,
    fees: undefined,
  }
}

export const selectLatestMarketData = (marketData?: number[][]) =>
  marketData?.[marketData.length - 1]?.[1] || 0

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
  isCompact: boolean = false,
) => {
  if (amount === null || amount === undefined) return ''

  return Intl.NumberFormat('en', {
    notation: isCompact ? 'compact' : undefined,
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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

export function formatWeiAsNumber(
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
  const bytes = await getCode(client, { address })

  return bytes !== undefined
}
