import { ARBITRUM } from '@/constants/chains'
import {
  indicesTokenList,
  indicesTokenListArbitrum,
} from '@/constants/tokenlists'
import {
  Bitcoin2xFlexibleLeverageIndex,
  ETH,
  Ethereum2xFlexibleLeverageIndex,
  IndexCoopBitcoin2xIndex,
  IndexCoopEthereum2xIndex,
  MetaverseIndex,
  USDC,
  icETHIndex,
} from '@/constants/tokens'

import { PathResolver } from './path-resolver'

describe('PathResolver', () => {
  const defaultIndex = indicesTokenList[0].symbol

  it('returns default for path: /swap', async () => {
    const pathComponents: string[] = []
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.isMinting).toBe(true)
    expect(resolvedPath.inputToken.symbol).toBe(ETH.symbol)
    expect(resolvedPath.outputToken.symbol).toBe(indicesTokenList[0].symbol)
  })

  it('returns default for path: /swap (Arbitrum)', async () => {
    const pathComponents: string[] = []
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents, ARBITRUM.chainId)
    expect(resolvedPath.isMinting).toBe(true)
    expect(resolvedPath.inputToken.symbol).toBe(ETH.symbol)
    expect(resolvedPath.outputToken.symbol).toBe(
      indicesTokenListArbitrum[0].symbol,
    )
  })

  it('returns an input token for path: /swap/usdc', async () => {
    const pathComponents = ['usdc']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.isMinting).toBe(true)
    expect(resolvedPath.inputToken.symbol).toBe(USDC.symbol)
    expect(resolvedPath.outputToken.symbol).toBe(indicesTokenList[0].symbol)
  })

  it('returns an input and output token for path: /swap/usdc/mvi', async () => {
    const pathComponents = ['usdc', 'mvi']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.isMinting).toBe(true)
    expect(resolvedPath.inputToken.symbol).toBe(USDC.symbol)
    expect(resolvedPath.outputToken.symbol).toBe(MetaverseIndex.symbol)
  })

  it('returns default for input token for path: /swap/_/mvi', async () => {
    const pathComponents = ['_', 'mvi']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.isMinting).toBe(true)
    expect(resolvedPath.inputToken.symbol).toBe(ETH.symbol)
    expect(resolvedPath.outputToken.symbol).toBe(MetaverseIndex.symbol)
  })

  it('returns default index for path: /swap/eth/_', async () => {
    const pathComponents = ['eth', '_']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.isMinting).toBe(true)
    expect(resolvedPath.inputToken.symbol).toBe(ETH.symbol)
    expect(resolvedPath.outputToken.symbol).toBe(indicesTokenList[0].symbol)
  })

  it('returns default for longer wrong path: /swap/usdc/mvi/eth', async () => {
    const pathComponents = ['usdc', 'mvi', 'eth']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.isMinting).toBe(true)
    expect(resolvedPath.inputToken.symbol).toBe(ETH.symbol)
    expect(resolvedPath.outputToken.symbol).toBe(indicesTokenList[0].symbol)
  })

  it('returns default for wrong path with two indices: /swap/ic21/mvi', async () => {
    const pathComponents = ['ic21', 'mvi']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.isMinting).toBe(true)
    expect(resolvedPath.inputToken.symbol).toBe(ETH.symbol)
    expect(resolvedPath.outputToken.symbol).toBe(MetaverseIndex.symbol)
  })

  it('returns default for wrong path with two currencies: /swap/eth/usdc', async () => {
    const pathComponents = ['eth', 'usdc']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.isMinting).toBe(true)
    expect(resolvedPath.inputToken.symbol).toBe(ETH.symbol)
    expect(resolvedPath.outputToken.symbol).toBe(defaultIndex)
  })

  it('returns minting state correctly for redeeming: /swap/mvi/usdc', async () => {
    const pathComponents = ['mvi', 'usdc']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.isMinting).toBe(false)
    expect(resolvedPath.inputToken.symbol).toBe(MetaverseIndex.symbol)
    expect(resolvedPath.outputToken.symbol).toBe(USDC.symbol)
  })

  it('returns correct state for: /swap/usdc/iceth', async () => {
    const pathComponents = ['usdc', 'iceth']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.isMinting).toBe(true)
    expect(resolvedPath.inputToken.symbol).toBe(ETH.symbol)
    expect(resolvedPath.outputToken.symbol).toBe(icETHIndex.symbol)
  })

  it.skip('returns correct state for: /swap/eth2x-fli/eth2x', async () => {
    const pathComponents = ['eth2x-fli', 'eth2x']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.isMinting).toBe(false)
    expect(resolvedPath.inputToken.symbol).toBe(
      Ethereum2xFlexibleLeverageIndex.symbol,
    )
    expect(resolvedPath.outputToken.symbol).toBe(
      IndexCoopEthereum2xIndex.symbol,
    )
  })

  it.skip('returns correct state for: /swap/btc2x-fli/btc2x', async () => {
    const pathComponents = ['btc2x-fli', 'btc2x']
    const resolver = new PathResolver()
    const resolvedPath = resolver.resolve(pathComponents)
    expect(resolvedPath.isMinting).toBe(false)
    expect(resolvedPath.inputToken.symbol).toBe(
      Bitcoin2xFlexibleLeverageIndex.symbol,
    )
    expect(resolvedPath.outputToken.symbol).toBe(IndexCoopBitcoin2xIndex.symbol)
  })
})
