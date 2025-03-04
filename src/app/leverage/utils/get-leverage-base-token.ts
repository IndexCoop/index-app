import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { base } from 'viem/chains'

import { BTC, ETH } from '@/constants/tokens'

const uSol = getTokenByChainAndSymbol(base.id, 'uSOL')
const uSui = getTokenByChainAndSymbol(base.id, 'uSUI')

export function getLeverageBaseToken(symbol: string) {
  if (symbol.toLowerCase() === 'uSOL2x'.toLowerCase()) return uSol
  if (symbol.toLowerCase() === 'uSUI2x'.toLowerCase()) return uSui
  if (symbol.toLowerCase() === 'BTC2xETH'.toLowerCase()) return BTC
  if (symbol.toLowerCase() === 'ETH2xBTC'.toLowerCase()) return ETH
  if (symbol.includes('BTC')) {
    return BTC
  }
  if (symbol.includes('ETH')) {
    return ETH
  }
  return null
}
