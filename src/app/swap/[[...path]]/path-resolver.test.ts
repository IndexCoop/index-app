import indexNames from '@/constants/tokenlists'
import { ETH, MetaverseIndex, USDC } from '@/constants/tokens'
import { PathResolver } from './path-resolver'

describe('PathResolver', () => {
  it('returns default for path: /swap', async () => {
    const pathComponents: string[] = []
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.inputToken.symbol).toBe(ETH.symbol)
    expect(resolvedPath.outputToken.symbol).toBe(indexNames[0].symbol)
  })

  it('returns an input token for path: /swap/usdc', async () => {
    const pathComponents = ['usdc']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.inputToken.symbol).toBe(USDC.symbol)
    expect(resolvedPath.outputToken.symbol).toBe(indexNames[0].symbol)
  })

  it('returns an input and output token for path: /swap/usdc/mvi', async () => {
    const pathComponents = ['usdc', 'mvi']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.inputToken.symbol).toBe(USDC.symbol)
    expect(resolvedPath.outputToken.symbol).toBe(MetaverseIndex.symbol)
  })

  it('returns default for input token for path: /swap/_/mvi', async () => {
    const pathComponents = ['_', 'mvi']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.inputToken.symbol).toBe(ETH.symbol)
    expect(resolvedPath.outputToken.symbol).toBe(MetaverseIndex.symbol)
  })

  it('returns default index for path: /swap/eth/_', async () => {
    const pathComponents = ['eth', '_']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.inputToken.symbol).toBe(ETH.symbol)
    expect(resolvedPath.outputToken.symbol).toBe(indexNames[0].symbol)
  })

  it('returns default for longer wrong path: /swap/usdc/mvi/eth', async () => {
    const pathComponents = ['usdc', 'mvi', 'eth']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.inputToken.symbol).toBe(ETH.symbol)
    expect(resolvedPath.outputToken.symbol).toBe(indexNames[0].symbol)
  })

  it('returns default for wrong path with two indices: /swap/ic21/mvi', async () => {
    const pathComponents = ['ic21', 'mvi']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.inputToken.symbol).toBe(ETH.symbol)
    expect(resolvedPath.outputToken.symbol).toBe(MetaverseIndex.symbol)
  })
})
