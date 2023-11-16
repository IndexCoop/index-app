import indexNames from '@/constants/tokenlists'
import { ETH, Token } from '@/constants/tokens'
import { getCurrencyTokens } from '@/lib/utils/tokens'

interface ResolvedPath {
  inputToken: string | null
  outputToken: string | null
}

interface ResolvedTokenPath {
  inputToken: Token
  outputToken: Token
}

export class PathResolver {
  // Returns resolved token path - always.
  // If the path shouldn't be resolvable - a default will be returned.
  resolve(path: string[]): ResolvedTokenPath {
    const symbols = this.convertPathToSymbols(path)
    /// both null
    if (symbols.inputToken === null && symbols.outputToken === null)
      return {
        inputToken: ETH,
        outputToken: indexNames[0],
      }

    if (symbols.inputToken === null) {
      const outputToken = this.resolveToken(symbols.outputToken!)
      const isIndex = indexNames.find(
        (token) => token.symbol === outputToken.symbol
      )
      return {
        inputToken: isIndex ? ETH : indexNames[0],
        outputToken: outputToken,
      }
    }

    if (symbols.outputToken === null) {
      const inputToken = this.resolveToken(symbols.inputToken!)
      const isIndex = indexNames.find(
        (token) => token.symbol === inputToken.symbol
      )
      return {
        inputToken,
        outputToken: isIndex ? ETH : indexNames[0],
      }
    }

    const inputToken = this.resolveToken(symbols.inputToken!)
    const outputToken = this.resolveToken(symbols.outputToken!)
    const inputTokenIsIndex = indexNames.some(
      (token) => token.symbol === inputToken.symbol
    )
    const outputTokenIsIndex = indexNames.some(
      (token) => token.symbol === outputToken.symbol
    )
    return {
      inputToken: inputTokenIsIndex && outputTokenIsIndex ? ETH : inputToken,
      outputToken,
    }
  }

  private convertPathToSymbols(path: string[]): ResolvedPath {
    const defaultReturn = { inputToken: null, outputToken: null }
    if (!path || path.length < 1) return defaultReturn
    if (path.length === 1) {
      return { inputToken: this.resolveTokenSymbol(path[0]), outputToken: null }
    }
    if (path.length === 2) {
      return {
        inputToken: this.resolveTokenSymbol(path[0]),
        outputToken: this.resolveTokenSymbol(path[1]),
      }
    }
    return defaultReturn
  }

  private resolveTokenSymbol(symbol: string): string | null {
    return symbol === '' || symbol === '_' ? null : symbol
  }

  private resolveToken(tokenSymbol: string): Token {
    const indexToken = indexNames.find(
      (token) => token.symbol.toLowerCase() === tokenSymbol.toLowerCase()
    )
    if (indexToken !== undefined) {
      return indexToken
    }
    const currencies = getCurrencyTokens(1)
    const currencyToken = currencies.find(
      (token) => token.symbol.toLowerCase() === tokenSymbol.toLowerCase()
    )
    if (currencyToken !== undefined) {
      return currencyToken
    }
    // If unsupported token, we just return the default token
    return ETH
  }
}
