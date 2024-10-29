import {
  formatPercentage,
  formatPrice,
  formatTvl,
} from '@/app/(light)/products/utils/formatters'

describe('formatters tests', () => {
  it('formatTvl', () => {
    expect(formatTvl(undefined)).toBe('')
    expect(formatTvl(null)).toBe('')
    expect(formatTvl(10)).toBe('$10.00')
    expect(formatTvl(1000)).toBe('$1.00K')
    expect(formatTvl(999445)).toBe('$999.45K')
    expect(formatTvl(1000000)).toBe('$1.00M')
    expect(formatTvl(520000001)).toBe('$520.00M')
  })
  it('formatPercentage', () => {
    expect(formatPercentage(undefined)).toBe('')
    expect(formatPercentage(null)).toBe('')
    expect(formatPercentage(10)).toBe('10.00%')
    expect(formatPercentage(54.123)).toBe('54.12%')
    expect(formatPercentage(-4)).toBe('-4.00%')
  })
  it('formatPrice', () => {
    expect(formatPrice(undefined)).toBe('')
    expect(formatPrice(null)).toBe('')
    expect(formatPrice(2309.2)).toBe('$2,309.20')
    expect(formatPrice(3.11)).toBe('$3.11')
  })
})
