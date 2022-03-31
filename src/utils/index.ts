import { BigNumber, Contract, Signer } from 'ethers'

import { Provider } from '@ethersproject/abstract-provider'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { ChainId } from '@usedapp/core'

import { MAINNET, OPTIMISM, POLYGON } from 'constants/chains'
import { Token } from 'constants/tokens'

import { ERC20_ABI } from './abi/ERC20'

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
    return Number(formatUnits(number, power)).toFixed(decimals)
  }

  return formatUnits(number, power)
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

export const getERC20Contract = async (
  provider: Signer | Provider | undefined,
  address: string
): Promise<Contract> => {
  return await new Contract(address, ERC20_ABI, provider)
}

/**
 * Formats a BigNumber from Gwei
 * @param decimals round to decimals is NOT precise
 * @param power default to 9 covers most token decimals
 */
export const displayFromGwei = (
  number: BigNumber | undefined,
  decimals: number = 0,
  power: number = 9
): string | null => {
  if (!number) return null

  if (decimals) {
    return Number(formatUnits(number, power)).toFixed(decimals)
  }

  return formatUnits(number, power)
}

/**
 * Returns chain-appropriate token address
 * @param token
 * @param chainId
 * @returns
 */
export const getChainAddress = (
  token: Token,
  chainId: ChainId = MAINNET.chainId
) => {
  switch (chainId) {
    case OPTIMISM.chainId:
      return token.optimismAddress
    case POLYGON.chainId:
      return token.polygonAddress
    default:
      return token.address
  }
}
