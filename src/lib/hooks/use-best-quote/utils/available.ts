import {
  BedIndex,
  Bitcoin2xFlexibleLeverageIndex,
  CoinDeskEthTrendIndex,
  Ethereum2xFlexibleLeverageIndex,
  GitcoinStakedETHIndex,
  IndexCoopBitcoin2xIndex,
  IndexCoopEthereum2xIndex,
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

export function isAvailableForRedemption(
  inputToken: Token,
  outputToken: Token,
): boolean {
  return (
    (inputToken.symbol === Bitcoin2xFlexibleLeverageIndex.symbol &&
      outputToken.symbol === IndexCoopBitcoin2xIndex.symbol) ||
    (inputToken.symbol === Ethereum2xFlexibleLeverageIndex.symbol &&
      outputToken.symbol === IndexCoopEthereum2xIndex.symbol)
  )
}

export function isAvailableForSwap(token: Token): boolean {
  switch (token.symbol) {
    case CoinDeskEthTrendIndex.symbol:
    case IndexCoopBitcoin2xIndex.symbol:
    case LeveragedRethStakingYield.symbol:
      return false
    default:
      return true
  }
}
