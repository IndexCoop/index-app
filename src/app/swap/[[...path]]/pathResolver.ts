interface ResolvedPath {
  inputToken: string | null
  outputToken: string | null
}

export class PathResolver {
  // Returns resolved path.
  // Either one could be set or also both input and output token.
  // If no token is set, only the /swap path was called.
  resolve(path: string): ResolvedPath {
    const defaultReturn = { inputToken: null, outputToken: null }
    const pathParts = path.split('/')
    const parts = pathParts.slice(1)
    console.log(pathParts, parts)
    if (parts.length <= 1) return defaultReturn
    const tokens = parts.slice(1)
    if (tokens.length === 1) {
      return { inputToken: this.resolveToken(tokens[0]), outputToken: null }
    }
    if (tokens.length === 2) {
      return {
        inputToken: this.resolveToken(tokens[0]),
        outputToken: this.resolveToken(tokens[1]),
      }
    }
    return defaultReturn
  }

  resolveToken(token: string): string | null {
    return token === '' || token === '_' ? null : token
  }
}
