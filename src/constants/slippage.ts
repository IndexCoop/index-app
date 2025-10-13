import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { base } from 'viem/chains'

const hyETH = getTokenByChainAndSymbol(1, 'hyETH')
const icETH = getTokenByChainAndSymbol(1, 'icETH')
const wstETH15x = getTokenByChainAndSymbol(base.id, 'wstETH15x')

// Slippage default hard coded to 0.5%
export const slippageDefault = 0.5

export const slippageMap = new Map<string, number>([
  [hyETH.address, 0.05],
  [icETH.address, 0.15],
  [wstETH15x.address, 0.2],
])
