import {
  DefiPulseIndex,
  HighYieldETHIndex,
  MetaverseIndex,
  icETHIndex,
} from '@/constants/tokens'

export function getFlashMintGasDefault(symbol: string) {
  // INDEX are not available for flash mint
  switch (symbol) {
    case DefiPulseIndex.symbol:
      return 2_000_000
    case HighYieldETHIndex.symbol:
      return 250_000
    case icETHIndex.symbol:
      return 1_500_000
    case MetaverseIndex.symbol:
      return 2_000_000
    default:
      return 2_000_000
  }
}
