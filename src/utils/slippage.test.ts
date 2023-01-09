import { slippageMap } from 'constants/slippage'
import { icETHIndex, WSETH2 } from 'constants/tokens'

import { getSlippageModification, selectSlippage } from './slippage'

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

describe('selectSlippage()', () => {
  it('returns given slippage for undefined token', () => {
    const symbol = 'MVI'
    const slippageModified = getSlippageModification(symbol)
    const result = selectSlippage(1, symbol)
    expect(slippageModified).toBeNull()
    expect(result).toBe(1)
  })

  it('returns correct slippage for token in mapping (bigger value)', () => {
    const symbol = icETHIndex.symbol
    const slippageModified = getSlippageModification(symbol)
    const result = selectSlippage(1, symbol)
    expect(slippageModified).toBe(slippageMap.get(symbol))
    expect(result).toBe(slippageModified)
  })

  it('returns correct slippage for token in mapping (smaller value)', () => {
    const symbol = WSETH2.symbol
    const slippageModified = getSlippageModification(symbol)
    const result = selectSlippage(1, symbol)
    expect(slippageModified).toBe(slippageMap.get(symbol))
    expect(result).toBe(slippageModified)
  })

  it('returns correct slippage when default was modified by user', () => {
    const expectedSlippaged = 2
    const symbol = WSETH2.symbol
    const slippageModified = getSlippageModification(symbol)
    const result = selectSlippage(expectedSlippaged, symbol)
    expect(slippageModified).toBe(slippageMap.get(symbol))
    expect(result).toBe(expectedSlippaged)
  })
})
