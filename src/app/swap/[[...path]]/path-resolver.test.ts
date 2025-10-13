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

  it('returns default for wrong path with two currencies: /swap/eth/usdc', async () => {
    const pathComponents = ['eth', 'usdc']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.isMinting).toBe(false)
    expect(resolvedPath.inputToken.symbol).toBe(defaultIndex)
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
