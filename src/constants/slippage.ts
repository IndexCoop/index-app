import { DiversifiedStakedETHIndex, icETHIndex, WSETH2 } from './tokens'

// Slippage default hard coded to 1%
export const slippageDefault = 1

export const slippageMap = new Map([
  [DiversifiedStakedETHIndex.symbol, 0.0001],
  [icETHIndex.symbol, 2],
  [WSETH2.symbol, 0.1],
])
