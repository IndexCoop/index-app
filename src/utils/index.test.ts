import { BigNumber } from '@ethersproject/bignumber'

import { displayFromWei, toWei } from '.'

describe('displayFromWei', () => {
  it('should convert to token value, default decimals', () => {
    const displayValue = displayFromWei(BigNumber.from('180313000000000000000'))
    expect(displayValue).toBe('180.31')
  })
  it('should convert to token value, given decimals', () => {
    const displayValue = displayFromWei(
      BigNumber.from('180313000000000000000'),
      5
    )
    expect(displayValue).toBe('180.31300')
  })
})

describe('toWei', () => {
  it('should convert string token value to wei', () => {
    const value = toWei(Number('40.242'))
    expect(value).toStrictEqual(BigNumber.from('40242000000000000000'))
  })
  it('should convert number token value to wei', () => {
    const value = toWei(40.242)
    expect(value).toStrictEqual(BigNumber.from('40242000000000000000'))
  })
})
