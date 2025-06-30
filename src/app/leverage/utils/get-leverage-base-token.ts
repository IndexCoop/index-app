import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { base } from 'viem/chains'

import { BTC, ETH } from '@/constants/tokens'

const uSol = getTokenByChainAndSymbol(base.id, 'uSOL')
const uSui = getTokenByChainAndSymbol(base.id, 'uSUI')
const uXrp = getTokenByChainAndSymbol(base.id, 'uXRP')

export function getLeverageBaseToken(symbol: string) {
  if (symbol.toLowerCase() === 'uSOL2x'.toLowerCase()) return uSol
  if (symbol.toLowerCase() === 'uSOL3x'.toLowerCase()) return uSol
  if (symbol.toLowerCase() === 'uSUI2x'.toLowerCase()) return uSui
  if (symbol.toLowerCase() === 'uSUI3x'.toLowerCase()) return uSui
  if (symbol.toLowerCase() === 'uXRP2x'.toLowerCase()) return uXrp
  if (symbol.toLowerCase() === 'uXRP3x'.toLowerCase()) return uXrp
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
