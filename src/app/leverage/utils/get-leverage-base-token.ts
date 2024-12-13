import { BTC, ETH } from '@/constants/tokens'

export function getLeverageBaseToken(symbol: string) {
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
