import { candlesToBars, resolutionToGranularity } from './datafeed'
import { barTimeFor, nextBar } from './streaming'

describe('resolutionToGranularity', () => {
  it('maps TradingView resolutions to Coinbase granularities', () => {
    expect(resolutionToGranularity('1')).toBe(60)
    expect(resolutionToGranularity('60')).toBe(3600)
    expect(resolutionToGranularity('1H')).toBe(3600)
    expect(resolutionToGranularity('1D')).toBe(86400)
    expect(resolutionToGranularity('nonsense')).toBe(3600)
  })
})

describe('candlesToBars', () => {
  // [time, low, high, open, close, volume], newest first.
  const candles: [number, number, number, number, number, number][] = [
    [200, 10, 20, 12, 18, 1],
    [100, 1, 2, 1.2, 1.8, 1],
  ]

  it('sorts oldest first and keeps OHLC', () => {
    const bars = candlesToBars(candles, false)
    expect(bars.map((bar) => bar.time)).toEqual([100_000, 200_000])
    expect(bars[1]).toEqual({
      time: 200_000,
      low: 10,
      high: 20,
      open: 12,
      close: 18,
    })
  })

  it('swaps high and low when inverting a pair', () => {
    const [bar] = candlesToBars([candles[0]], true)
    expect(bar.low).toBeCloseTo(1 / 20)
    expect(bar.high).toBeCloseTo(1 / 10)
    expect(bar.low).toBeLessThan(bar.high)
  })
})

describe('nextBar', () => {
  it('buckets a trade time to the candle open', () => {
    expect(barTimeFor(3_700_000, 3600)).toBe(3_600_000)
  })

  it('folds a trade into the open bar', () => {
    const bar = { time: 3_600_000, open: 10, high: 12, low: 9, close: 11 }
    expect(nextBar(bar, 15, 3_700_000, 3600)).toEqual({
      time: 3_600_000,
      open: 10,
      high: 15,
      low: 9,
      close: 15,
    })
  })

  it('opens a new bar once the bucket rolls over', () => {
    const bar = { time: 3_600_000, open: 10, high: 12, low: 9, close: 11 }
    expect(nextBar(bar, 15, 7_200_000, 3600)).toEqual({
      time: 7_200_000,
      open: 15,
      high: 15,
      low: 15,
      close: 15,
    })
  })
})
