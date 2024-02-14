import { MainnetTokens } from '@indexcoop/tokenlists'

export const getTokenFromSymbol = (symbol: string) =>
  MainnetTokens.find(
    (token) => token.symbol.toLowerCase() === symbol.toLowerCase(),
  )
