import { indicesTokenList } from '@/constants/tokenlists'
import { ETH, Token } from '@/constants/tokens'
import {
  getCurrencyTokens,
  getCurrencyTokensForIndex,
  getDefaultIndex,
} from '@/lib/utils/tokens'

interface ResolvedPath {
  inputToken: string | null
  outputToken: string | null
}

interface ResolvedTokenPath {
  isMinting: boolean
  inputToken: Token
  outputToken: Token
}

export class PathResolver {
  // Returns resolved token path - always.
  // If the path shouldn't be resolvable - a default will be returned.
  resolve(path: string[], chainId: number = 1): ResolvedTokenPath {
    const defaultIndex = getDefaultIndex(chainId)
    const symbols = this.convertPathToSymbols(path)

    if (symbols.inputToken === null && symbols.outputToken === null)
      return {
        isMinting: true,
        inputToken: ETH,
        outputToken: defaultIndex,
      }

    let inputToken = this.resolveToken(symbols.inputToken ?? ETH.symbol)
    let outputToken = this.resolveToken(
      symbols.outputToken ?? defaultIndex.symbol,
    )

    const inputTokenIsIndex = indicesTokenList.some(
      (token) => token.symbol === inputToken.symbol,
    )
    const outputTokenIsIndex = indicesTokenList.some(
      (token) => token.symbol === outputToken.symbol,
    )

    if (!inputTokenIsIndex && !outputTokenIsIndex)
      return {
        isMinting: true,
        inputToken: ETH,
        outputToken: defaultIndex,
      }

    if (outputTokenIsIndex || (inputTokenIsIndex && outputTokenIsIndex)) {
      inputToken = this.getCurrency(outputToken, inputToken)
    }

    if (inputTokenIsIndex && !outputTokenIsIndex) {
      outputToken = this.getCurrency(inputToken, outputToken)
    }

    return {
      isMinting: outputTokenIsIndex,
      inputToken,
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

  private getCurrency(indexToken: Token, inputOutputToken: Token): Token {
    const currencies = getCurrencyTokensForIndex(indexToken, 1)
    const tokenIsAvailableCurrency = currencies.some(
      (token) => token.symbol === inputOutputToken.symbol,
    )
    return tokenIsAvailableCurrency ? inputOutputToken : currencies[0]
  }

  private resolveTokenSymbol(symbol: string): string | null {
    return symbol === '' || symbol === '_' ? null : symbol
  }

  private resolveToken(tokenSymbol: string): Token {
    const indexToken = indicesTokenList.find(
      (token) => token.symbol.toLowerCase() === tokenSymbol.toLowerCase(),
    )
    if (indexToken !== undefined) {
      return indexToken
    }
    const currencies = getCurrencyTokens(1)
    const currencyToken = currencies.find(
      (token) => token.symbol.toLowerCase() === tokenSymbol.toLowerCase(),
    )
    if (currencyToken !== undefined) {
      return currencyToken
    }
    // If unsupported token, we just return the default token
    return ETH
  }
}
