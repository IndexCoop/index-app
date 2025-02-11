import { ARBITRUM } from '@/constants/chains'
import {
  indicesTokenList,
  indicesTokenListArbitrum,
} from '@/constants/tokenlists'
import { ETH } from '@/constants/tokens'

import { PathResolver } from './path-resolver'

describe('PathResolver', () => {
  const defaultIndex = indicesTokenList[0].symbol

  it('returns default for path: /swap', async () => {
    const pathComponents: string[] = []
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.isMinting).toBe(false)
    expect(resolvedPath.inputToken.symbol).toBe(indicesTokenList[0].symbol)
    expect(resolvedPath.outputToken.symbol).toBe('ETH')
  })

  it('returns default for path: /swap (Arbitrum)', async () => {
    const pathComponents: string[] = []
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents, ARBITRUM.chainId)
    expect(resolvedPath.isMinting).toBe(false)
    expect(resolvedPath.inputToken.symbol).toBe(
      indicesTokenListArbitrum[0].symbol,
    )
    expect(resolvedPath.outputToken.symbol).toBe(ETH.symbol)
  })

  it('returns an input and output token for path: /swap/usdc/mvi', async () => {
    const pathComponents = ['usdc', 'mvi']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.isMinting).toBe(false)
    expect(resolvedPath.inputToken.symbol).toBe('MVI')
    expect(resolvedPath.outputToken.symbol).toBe('USDC')
  })

  it('returns default for input token for path: /swap/_/mvi', async () => {
    const pathComponents = ['_', 'mvi']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.isMinting).toBe(false)
    expect(resolvedPath.inputToken.symbol).toBe('MVI')
    expect(resolvedPath.outputToken.symbol).toBe(ETH.symbol)
  })

  it('returns default for longer wrong path: /swap/usdc/mvi/eth', async () => {
    const pathComponents = ['usdc', 'mvi', 'eth']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.isMinting).toBe(false)
    expect(resolvedPath.inputToken.symbol).toBe(indicesTokenList[0].symbol)
    expect(resolvedPath.outputToken.symbol).toBe(ETH.symbol)
  })

  it('returns default for wrong path with two indices: /swap/dpi/mvi', async () => {
    const pathComponents = ['dpi', 'mvi']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.isMinting).toBe(false)
    expect(resolvedPath.inputToken.symbol).toBe('MVI')
    expect(resolvedPath.outputToken.symbol).toBe(ETH.symbol)
  })

  it('returns default for wrong path with two currencies: /swap/eth/usdc', async () => {
    const pathComponents = ['eth', 'usdc']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.isMinting).toBe(false)
    expect(resolvedPath.inputToken.symbol).toBe(defaultIndex)
    expect(resolvedPath.outputToken.symbol).toBe(ETH.symbol)
  })

  it('returns minting state correctly for redeeming: /swap/mvi/usdc', async () => {
    const pathComponents = ['mvi', 'usdc']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.isMinting).toBe(false)
    expect(resolvedPath.inputToken.symbol).toBe('MVI')
    expect(resolvedPath.outputToken.symbol).toBe('USDC')
  })

  it('returns minting state correctly for minting: /swap/eth/dseth (disallowed; redeem only)', async () => {
    const pathComponents = ['eth', 'dseth']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.isMinting).toBe(false)
    expect(resolvedPath.inputToken.symbol).toBe('dsETH')
    expect(resolvedPath.outputToken.symbol).toBe(ETH.symbol)
  })

  it('returns minting state correctly for minting: /swap/eth/hyeth (disallowed; redeem only)', async () => {
    const pathComponents = ['eth', 'hyeth']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.isMinting).toBe(false)
    expect(resolvedPath.inputToken.symbol).toBe('hyETH')
    expect(resolvedPath.outputToken.symbol).toBe(ETH.symbol)
  })
})
