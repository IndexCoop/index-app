import {
  CoinDeskEthTrendIndex,
  HighYieldETHIndex,
  WSETH2,
  icETHIndex,
} from './tokens'

// Slippage default hard coded to 0.5%
export const slippageDefault = 0.5

export const slippageMap = new Map([
  [CoinDeskEthTrendIndex.symbol, 0.5],
  [HighYieldETHIndex.symbol, 0.05],
  [icETHIndex.symbol, 0.5],
  [WSETH2.symbol, 0.1],
])
