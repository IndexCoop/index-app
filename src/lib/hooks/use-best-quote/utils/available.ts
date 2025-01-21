import {
  CoinDeskEthTrendIndex,
  IndexToken,
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

export function isAvailableForIssuance(
  inputToken: Token,
  outputToken: Token,
): boolean {
  return (
    inputToken.symbol === RealWorldAssetIndex.symbol ||
    outputToken.symbol === RealWorldAssetIndex.symbol
  )
}

export function isAvailableForSwap(token: Token): boolean {
  switch (token.symbol) {
    case CoinDeskEthTrendIndex.symbol:
      return false
    default:
      return true
  }
}
