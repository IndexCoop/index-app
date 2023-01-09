import { icETHIndex, WSETH2 } from './tokens'

// Slippage default hard coded to 1%
export const slippageDefault = 1

export const slippageMap = new Map([
  [icETHIndex.symbol, 2],
  [WSETH2.symbol, 0.1],
])
