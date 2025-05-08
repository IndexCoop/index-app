import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'

const hyETH = getTokenByChainAndSymbol(1, 'hyETH')
const icETH = getTokenByChainAndSymbol(1, 'icETH')

// Slippage default hard coded to 0.5%
export const slippageDefault = 0.5

export const slippageMap = new Map<string, number>([
  [hyETH.address, 0.05],
  [icETH.address, 0.15],
])
