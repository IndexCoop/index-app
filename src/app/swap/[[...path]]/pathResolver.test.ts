import { PathResolver } from './pathResolver'

describe('PathResolver', () => {
  it('returns null for path: /swap', async () => {
    const path = '/swap'
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(path)
    expect(resolvedPath.inputToken).toBeNull()
    expect(resolvedPath.outputToken).toBeNull()
  })

  it('returns null for path: /unknown', async () => {
    const path = '/unknown'
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(path)
    expect(resolvedPath.inputToken).toBeNull()
    expect(resolvedPath.outputToken).toBeNull()
  })

  it('returns an input token for path: /swap/usdc', async () => {
    const path = '/swap/usdc'
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(path)
    expect(resolvedPath.inputToken).toBe('usdc')
    expect(resolvedPath.outputToken).toBeNull()
  })

  it('returns an input and output token for path: /swap/usdc/mvi', async () => {
    const path = '/swap/usdc/mvi'
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(path)
    expect(resolvedPath.inputToken).toBe('usdc')
    expect(resolvedPath.outputToken).toBe('mvi')
  })

  it('returns input token as null and output token for path: /swap/_/mvi', async () => {
    const path = '/swap/_/mvi'
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(path)
    expect(resolvedPath.inputToken).toBeNull()
    expect(resolvedPath.outputToken).toBe('mvi')
  })

  it('returns input token and output token as null for path: /swap/eth/_', async () => {
    const path = '/swap/eth/_'
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(path)
    expect(resolvedPath.inputToken).toBe('eth')
    expect(resolvedPath.outputToken).toBeNull()
  })

  it('returns null for longer wrong path: /swap/usdc/mvi/eth', async () => {
    const path = '/swap/usdc/mvi/eth'
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(path)
    expect(resolvedPath.inputToken).toBeNull()
    expect(resolvedPath.outputToken).toBeNull()
  })
})
