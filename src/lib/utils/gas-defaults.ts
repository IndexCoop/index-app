import {
  Bitcoin2xFlexibleLeverageIndex,
  CoinDeskEthTrendIndex,
  DefiPulseIndex,
  Ethereum2xFlexibleLeverageIndex,
  HighYieldETHIndex,
  MetaverseIndex,
  RealWorldAssetIndex,
  icETHIndex,
} from '@/constants/tokens'

export function getFlashMintGasDefault(symbol: string) {
  // INDEX are not available for flash mint
  switch (symbol) {
    case Bitcoin2xFlexibleLeverageIndex.symbol:
      return 500_000
    case CoinDeskEthTrendIndex.symbol:
      return 500_000
    case DefiPulseIndex.symbol:
      return 2_000_000
    case Ethereum2xFlexibleLeverageIndex.symbol:
      return 500_000
    case HighYieldETHIndex.symbol:
      return 250_000
    case icETHIndex.symbol:
      return 1_500_000
    case MetaverseIndex.symbol:
      return 2_000_000
    case RealWorldAssetIndex.symbol:
      return 250_000
    default:
      return 2_000_000
  }
}
