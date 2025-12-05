import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { arbitrum, base, mainnet } from 'viem/chains'

import { BTC, ETH } from '@/constants/tokens'

const uSol = getTokenByChainAndSymbol(base.id, 'uSOL')
const uSui = getTokenByChainAndSymbol(base.id, 'uSUI')
const uXrp = getTokenByChainAndSymbol(base.id, 'uXRP')
const xAut = getTokenByChainAndSymbol(mainnet.id, 'XAUt')
const aave = getTokenByChainAndSymbol(arbitrum.id, 'AAVE')
const arb = getTokenByChainAndSymbol(arbitrum.id, 'ARB')
const link = getTokenByChainAndSymbol(arbitrum.id, 'LINK')

export function getLeverageBaseToken(symbol: string) {
  switch (symbol.toLowerCase()) {
    case 'AAVE2x'.toLowerCase():
      return aave
    case 'ARB2x'.toLowerCase():
      return arb
    case 'GOLD3x'.toLowerCase():
      return xAut
    case 'LINK2x'.toLowerCase():
      return link
    case 'uSOL2x'.toLowerCase():
      return uSol
    case 'uSOL3x'.toLowerCase():
      return uSol
    case 'uSUI2x'.toLowerCase():
      return uSui
    case 'uSUI3x'.toLowerCase():
      return uSui
    case 'uXRP2x'.toLowerCase():
      return uXrp
    case 'uXRP3x'.toLowerCase():
      return uXrp
    case 'BTC2xETH'.toLowerCase():
      return BTC
    case 'ETH2xBTC'.toLowerCase():
      return ETH
    default:
      return symbol.includes('BTC') ? BTC : symbol.includes('ETH') ? ETH : null
  }
}
