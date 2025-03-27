import { slippageMap } from '@/constants/slippage'
import { HighYieldETHIndex, icETHIndex } from '@/constants/tokens'

import { getSlippageOverrideOrNull, selectSlippage } from './slippage'

describe('getSlippageOverrideOrNull()', () => {
  it('returns null for unaltered slippage', () => {
    const symbol = 'MVI'
    const slippageOverride = getSlippageOverrideOrNull(symbol)
    expect(slippageOverride).toBe(null)
  })

  it('returns correct slippage for icETH', () => {
    const symbol = icETHIndex.symbol
    const slippageOverride = getSlippageOverrideOrNull(symbol)
    expect(slippageOverride).toBe(slippageMap.get(symbol))
  })
})

describe('selectSlippage()', () => {
  it('returns given slippage for undefined token', () => {
    const symbol = 'MVI'
    const slippageModified = getSlippageOverrideOrNull(symbol)
    const result = selectSlippage(1, symbol)
    expect(slippageModified).toBeNull()
    expect(result).toBe(1)
  })

  it('returns correct slippage for token in mapping (bigger value)', () => {
    const symbol = icETHIndex.symbol
    const expectedSlippage = slippageMap.get(symbol)
    const slippageModified = getSlippageOverrideOrNull(symbol)
    const result = selectSlippage(0.1, symbol)
    expect(slippageModified).toBe(expectedSlippage)
    expect(result).toBe(expectedSlippage)
  })

  it('returns correct slippage for hyETH', () => {
    const expectedSlippage = 0.05
    const index = HighYieldETHIndex.symbol
    const slippageModified = getSlippageOverrideOrNull(index)
    const result = selectSlippage(slippageModified!, index)
    expect(slippageModified).toBe(expectedSlippage)
    expect(result).toBe(expectedSlippage)
  })
})
