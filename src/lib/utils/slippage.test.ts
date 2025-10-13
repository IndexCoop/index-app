import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'

import { slippageMap } from '@/constants/slippage'

import { getSlippageOverrideOrNull, selectSlippage } from './slippage'

const hyETH = getTokenByChainAndSymbol(1, 'hyETH')
const icETH = getTokenByChainAndSymbol(1, 'icETH')

describe('getSlippageOverrideOrNull()', () => {
  it('returns correct slippage for icETH', () => {
    const address = icETH.address
    const slippageOverride = getSlippageOverrideOrNull(address)
    expect(slippageOverride).toBe(slippageMap.get(address))
  })
})

describe('selectSlippage()', () => {
  it('returns correct slippage for token in mapping (bigger value)', () => {
    const address = icETH.address
    const expectedSlippage = slippageMap.get(address)
    const slippageModified = getSlippageOverrideOrNull(address)
    const result = selectSlippage(0.1, address)
    expect(slippageModified).toBe(expectedSlippage)
    expect(result).toBe(expectedSlippage)
  })

  it('returns correct slippage for hyETH', () => {
    const expectedSlippage = 0.05
    const index = hyETH.address
    const slippageModified = getSlippageOverrideOrNull(index)
    const result = selectSlippage(slippageModified!, index)
    expect(slippageModified).toBe(expectedSlippage)
    expect(result).toBe(expectedSlippage)
  })
})
