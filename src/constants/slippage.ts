import {
  CoinDeskEthTrendIndex,
  DiversifiedStakedETHIndex,
  GitcoinStakedETHIndex,
  HighYieldETHIndex,
  icETHIndex,
  LeveragedRethStakingYield,
  WSETH2,
} from './tokens'

// Slippage default hard coded to 0.5%
export const slippageDefault = 0.5

export const slippageMap = new Map([
  [CoinDeskEthTrendIndex.symbol, 0.5],
  [DiversifiedStakedETHIndex.symbol, 0.0001],
  [GitcoinStakedETHIndex.symbol, 0.0001],
  [HighYieldETHIndex.symbol, 0.2],
  [icETHIndex.symbol, 0.5],
  [LeveragedRethStakingYield.symbol, 0.0001],
  [WSETH2.symbol, 0.1],
])
