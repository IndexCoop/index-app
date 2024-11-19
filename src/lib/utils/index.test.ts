import {
  formatAmountFromWei,
  formatDollarAmount,
  isValidTokenInput,
  parseUnits,
} from '.'

describe('formatAmountFromWei', () => {
  it('should return formatted amount for given wei', () => {
    const displayValue = formatAmountFromWei(
      BigInt('180313000000000000000'),
      18,
      3,
    )
    expect(displayValue).toBe('180.313')
    const displayValue2 = formatAmountFromWei(BigInt('1'), 18, 18)
    expect(displayValue2).toBe('0.000000000000000001')
  })

  it('should convert to token value, given decimals', () => {
    const displayValue = formatAmountFromWei(
      BigInt('180313000000000000000'),
      18,
      5,
    )
    expect(displayValue).toBe('180.31300')
  })

  it('should convert to token value, given large decimals', () => {
    const displayValue2 = formatAmountFromWei(BigInt('1'), 18, 18)
    expect(displayValue2).toBe('0.000000000000000001')
  })

  it('should convert to token value, given large decimals. Not precise.', () => {
    const displayValue = formatAmountFromWei(
      BigInt('157097183810163372336'),
      18,
      18,
    )
    expect(displayValue).toBe('157.097183810163400000')
  })

  it('should convert to token value showing commas for thousands', () => {
    const displayValue = formatAmountFromWei(
      BigInt('1570971838101633723360'),
      18,
      4,
    )
    expect(displayValue).toBe('1,570.9718')
  })

  it('should convert to token value showing commas for thousands w/ large amounts', () => {
    const displayValue = formatAmountFromWei(
      BigInt('507731000000000000000000'),
      18,
      4,
    )
    expect(displayValue).toBe('507,731.0000')
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

describe('parseUnits', () => {
  it('should convert string token value to wei', () => {
    const value = parseUnits('40.242', 18)
    expect(value).toStrictEqual(BigInt('40242000000000000000'))
  })
  it('should convert number token value to wei', () => {
    const value = parseUnits((40.242).toString(), 18)
    expect(value).toStrictEqual(BigInt('40242000000000000000'))
  })
  it('should convert USDC to wei', () => {
    const value = parseUnits('40.242', 6)
    expect(value).toStrictEqual(BigInt('40242000'))
  })
  it('should convert loooong values for USDC to wei', () => {
    const value = parseUnits('1265.544702110571614391', 6)
    expect(value).toStrictEqual(BigInt('1265544702'))
  })
})

describe('formatDollarAmount', () => {
  it('should display an empty string for null input', () => {
    const value = formatDollarAmount(null)
    expect(value).toStrictEqual('')
  })
  it('should display an empty string for undefined input', () => {
    const value = formatDollarAmount(undefined)
    expect(value).toStrictEqual('')
  })
  it('should display correct formatting for 0 input', () => {
    const value = formatDollarAmount(0)
    expect(value).toStrictEqual('$0.00')
  })
  it('should display empty string when hideZeroAmount is true', () => {
    const value = formatDollarAmount(0, true)
    expect(value).toStrictEqual('')
  })
  it('should display correct formatting for number input', () => {
    const value = formatDollarAmount(120123.45)
    expect(value).toStrictEqual('$120,123.45')
  })
})
