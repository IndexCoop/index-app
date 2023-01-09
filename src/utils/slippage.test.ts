import { slippageMap } from 'constants/slippage'
import { icETHIndex, WSETH2 } from 'constants/tokens'

import { getSlippageModification } from './slippage'

describe('getSlippageModification()', () => {
  it('returns null for unaltered slippage', () => {
    const symbol = 'MVI'
    const slippage = getSlippageModification(symbol)
    expect(slippage).toBe(null)
  })

  it('returns correct slippage for icETH', () => {
    const symbol = icETHIndex.symbol
    const slippage = getSlippageModification(symbol)
    expect(slippage).toBe(slippageMap.get(symbol))
  })

  it('returns correct slippage for wsETH2', () => {
    const symbol = WSETH2.symbol
    const slippage = getSlippageModification(symbol)
    expect(slippage).toBe(slippageMap.get(symbol))
  })
})
