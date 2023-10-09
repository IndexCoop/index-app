interface ResolvedPath {
  inputToken: string | null
  outputToken: string | null
}

export class PathResolver {
  // Returns resolved path.
  // Either one could be set or also both input and output token.
  // If no token is set, only the /swap path was called.
  resolve(path: string[]): ResolvedPath {
    const defaultReturn = { inputToken: null, outputToken: null }
    if (path.length < 1) return defaultReturn
    if (path.length === 1) {
      return { inputToken: this.resolveToken(path[0]), outputToken: null }
    }
    if (path.length === 2) {
      return {
        inputToken: this.resolveToken(path[0]),
        outputToken: this.resolveToken(path[1]),
      }
    }
    return defaultReturn
  }

  resolveToken(token: string): string | null {
    return token === '' || token === '_' ? null : token
  }
}
