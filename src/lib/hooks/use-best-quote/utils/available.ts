import { IndexToken, type Token } from '@/constants/tokens'

export function isAvailableForFlashMint(token: Token): boolean {
  switch (token.symbol) {
    case IndexToken.symbol:
      return false
    default:
      return true
  }
}
