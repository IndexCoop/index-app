import { slippageDefault, slippageMap } from '@/constants/slippage'
import {
  DAI,
  DiversifiedStakedETHIndex,
  GitcoinStakedETHIndex,
  MoneyMarketIndex,
  USDC,
  USDT,
} from '@/constants/tokens'

export function getSlippageOverrideOrNull(
  tokenSymbol: string,
  inputOutputTokenSymbol: string
): number | null {
  if (
    (tokenSymbol === DiversifiedStakedETHIndex.symbol ||
      tokenSymbol === GitcoinStakedETHIndex.symbol) &&
    inputOutputTokenSymbol === USDC.symbol
  ) {
    return 0.1
  }
  if (
    tokenSymbol === MoneyMarketIndex.symbol &&
    (inputOutputTokenSymbol === DAI.symbol ||
      inputOutputTokenSymbol === USDC.symbol ||
      inputOutputTokenSymbol === USDT.symbol)
  ) {
    return 0.001
  }
  return slippageMap.get(tokenSymbol) ?? null
}

export function selectSlippage(
  slippage: number,
  indexSymbol: string,
  inputOutputTokenSymbol: string
): number {
  if (slippage !== slippageDefault) return slippage
  const slippageOverrride = getSlippageOverrideOrNull(
    indexSymbol,
    inputOutputTokenSymbol
  )
  return slippageOverrride ?? slippage
}
