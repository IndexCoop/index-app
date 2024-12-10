import {
  BedIndex,
  CoinDeskEthTrendIndex,
  GitcoinStakedETHIndex,
  IndexToken,
  LeveragedRethStakingYield,
  RealWorldAssetIndex,
  Token,
} from '@/constants/tokens'

export function isAvailableForFlashMint(token: Token): boolean {
  switch (token.symbol) {
    case IndexToken.symbol:
      return false
    default:
      return true
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function isAvailableForIssuance(
  inputToken: Token,
  outputToken: Token,
): boolean {
  return (
    inputToken.symbol === BedIndex.symbol ||
    inputToken.symbol === GitcoinStakedETHIndex.symbol ||
    inputToken.symbol === LeveragedRethStakingYield.symbol ||
    inputToken.symbol === RealWorldAssetIndex.symbol ||
    outputToken.symbol === RealWorldAssetIndex.symbol
  )
}

export function isAvailableForSwap(token: Token): boolean {
  switch (token.symbol) {
    case CoinDeskEthTrendIndex.symbol:
    case LeveragedRethStakingYield.symbol:
      return false
    default:
      return true
  }
}
