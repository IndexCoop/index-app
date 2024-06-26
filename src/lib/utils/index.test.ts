import { BigNumber } from '@ethersproject/bignumber'

import { displayFromWei, isValidTokenInput, toWei } from '.'

describe('displayFromWei', () => {
  it('should return null with no number provided', () => {
    const displayValue = displayFromWei(undefined)
    expect(displayValue).toBe(null)
  })
  it('should convert to token value, default full value', () => {
    const displayValue = displayFromWei(BigNumber.from('180313000000000000000'))
    expect(displayValue).toBe('180.313')
    const displayValue2 = displayFromWei(BigNumber.from('1'))
    expect(displayValue2).toBe('0.000000000000000001')
  })
  it('should convert to token value, given decimals', () => {
    const displayValue = displayFromWei(
      BigNumber.from('180313000000000000000'),
      5,
    )
    expect(displayValue).toBe('180.31300')
  })
  it('should convert to token value, given large decimals', () => {
    const displayValue2 = displayFromWei(BigNumber.from('1'))
    expect(displayValue2).toBe('0.000000000000000001')
  })
  it('should convert to token value, given large decimals. Not precise.', () => {
    const displayValue = displayFromWei(
      BigNumber.from('157097183810163372336'),
      18,
    )
    expect(displayValue).toBe('157.097183810163400000')
  })
  it('should convert to token value showing commas for thousands', () => {
    const displayValue = displayFromWei(
      BigNumber.from('1570971838101633723360'),
      4,
    )
    expect(displayValue).toBe('1570.9718')
  })
  it('should convert to token value showing commas for thousands w/ large amounts', () => {
    const displayValue = displayFromWei(
      BigNumber.from('507731000000000000000000'),
      4,
    )
    expect(displayValue).toBe('507731.0000')
  })
})

describe('isValidTokenInput()', () => {
  describe('should return true when valid input', () => {
    it('zero', () => {
      expect(isValidTokenInput('0')).toBe(true)
    })
    it('positive number', () => {
      expect(isValidTokenInput('12')).toBe(true)
    })
    it('positive float', () => {
      expect(isValidTokenInput('3.4')).toBe(true)
    })
  })
  describe('should return false when invalid input', () => {
    it('empty string', () => {
      expect(isValidTokenInput('')).toBe(false)
    })
    it('input unless than zero', () => {
      expect(isValidTokenInput('-1')).toBe(false)
    })
    it('input has more decimals then token actual does (underflow)', () => {
      expect(isValidTokenInput('0.01', 1)).toBe(false)
    })
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
  it('should convert USDC to wei', () => {
    const value = toWei(Number('40.242'), 6)
    expect(value).toStrictEqual(BigNumber.from('40242000'))
  })
  it('should convert loooong values for USDC to wei', () => {
    const value = toWei('1265.544702110571614391', 6)
    expect(value).toStrictEqual(BigNumber.from('1265544702'))
  })
})
