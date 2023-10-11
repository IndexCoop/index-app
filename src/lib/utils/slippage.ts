import { slippageMap } from '@/constants/slippage'
import {
  DAI,
  DiversifiedStakedETHIndex,
  GitcoinStakedETHIndex,
  LeveragedRethStakingYield,
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
    tokenSymbol === LeveragedRethStakingYield.symbol &&
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
  const slippageOverrride = getSlippageOverrideOrNull(
    indexSymbol,
    inputOutputTokenSymbol
  )
  if (slippageOverrride && slippage < slippageOverrride)
    return slippageOverrride
  if (slippageOverrride && slippage > slippageOverrride) return slippage
  return slippageOverrride ?? slippage
}
