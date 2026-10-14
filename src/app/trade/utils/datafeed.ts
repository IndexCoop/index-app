import {
  subscribeOnStream,
  unsubscribeFromStream,
} from '@/app/trade/utils/streaming'

// Coinbase Exchange public market data API. No API key, CORS open.
// Replaces Pyth Benchmarks' TradingView shim, retired 2026-08-26.
const API_ENDPOINT = 'https://api.exchange.coinbase.com'

// Coinbase returns at most 300 candles per request.
const MAX_CANDLES_PER_REQUEST = 300
// Cap total requests per getBars call so a wide range can't hammer the API.
const MAX_REQUESTS = 12

// TradingView symbol -> Coinbase product. `inverted` pairs are served by the
// reciprocal product and flipped client side.
// NOTE: XAUTUSD has no Coinbase market, so that chart stays unresolved.
const symbolToProduct: Record<string, { product: string; inverted?: boolean }> =
  {
    AAVEUSD: { product: 'AAVE-USD' },
    BTCUSD: { product: 'BTC-USD' },
    ETHUSD: { product: 'ETH-USD' },
    LINKUSD: { product: 'LINK-USD' },
    SOLUSD: { product: 'SOL-USD' },
    SUIUSD: { product: 'SUI-USD' },
    XRPUSD: { product: 'XRP-USD' },
    ETHBTC: { product: 'ETH-BTC' },
    BTCETH: { product: 'ETH-BTC', inverted: true },
  }

const symbolToPriceScale: Record<string, number> = {
  AAVEUSD: 100,
  BTCUSD: 100,
  ETHUSD: 100,
  LINKUSD: 100,
  SOLUSD: 100,
  SUIUSD: 10000,
  XRPUSD: 10000,
  BTCETH: 10000,
  ETHBTC: 10000,
}

const getPriceScale = (symbol: string) => symbolToPriceScale[symbol] ?? 100

const SUPPORTED_RESOLUTIONS = ['1', '5', '15', '60', '360', '1D']

// Only these granularities are accepted by Coinbase.
export const resolutionToGranularity = (resolution: string): number => {
  switch (resolution) {
    case '1':
      return 60
    case '5':
      return 300
    case '15':
      return 900
    case '60':
    case '1H':
      return 3600
    case '360':
    case '6H':
      return 21600
    case 'D':
    case '1D':
      return 86400
    default:
      return 3600
  }
}

type Candle = [
  time: number,
  low: number,
  high: number,
  open: number,
  close: number,
  volume: number,
]

export type Bar = {
  time: number
  low: number
  high: number
  open: number
  close: number
}

// Coinbase candles are [time, low, high, open, close, volume], newest first.
export const candlesToBars = (candles: Candle[], inverted: boolean): Bar[] =>
  candles
    .map(([time, low, high, open, close]) => ({
      time: time * 1000,
      // Inverting swaps the extremes: 1/low is the high of the inverse pair.
      low: inverted ? 1 / high : low,
      high: inverted ? 1 / low : high,
      open: inverted ? 1 / open : open,
      close: inverted ? 1 / close : close,
    }))
    .sort((a, b) => a.time - b.time)

const configurationData = {
  supported_resolutions: SUPPORTED_RESOLUTIONS,
  supports_marks: false,
  supports_timescale_marks: false,
  supports_time: true,
  exchanges: [{ value: 'Coinbase', name: 'Coinbase', desc: 'Coinbase' }],
  symbols_types: [{ name: 'crypto', value: 'crypto' }],
}

// Keep a record of the most recent bar on the chart, for the realtime stream.
const lastBarsCache = new Map<string, Bar>()

const datafeed = {
  onReady: (callback: any) => {
    setTimeout(() => callback(configurationData))
  },
  // Symbol search is disabled in the widget (`header_symbol_search`).
  searchSymbols: (
    _userInput: any,
    _exchange: any,
    _symbolType: any,
    onResultReadyCallback: any,
  ) => {
    onResultReadyCallback([])
  },
  resolveSymbol: (
    symbolName: string,
    onSymbolResolvedCallback: any,
    onResolveErrorCallback: any,
  ) => {
    const mapping = symbolToProduct[symbolName]
    if (!mapping) {
      onResolveErrorCallback(`Cannot resolve symbol ${symbolName}`)
      return
    }

    const [base, quote] = mapping.inverted
      ? mapping.product.split('-').reverse()
      : mapping.product.split('-')

    setTimeout(() =>
      onSymbolResolvedCallback({
        ticker: symbolName,
        name: symbolName,
        full_name: symbolName,
        description: `${base} / ${quote}`,
        type: 'crypto',
        session: '24x7',
        timezone: 'Etc/UTC',
        exchange: 'Coinbase',
        listed_exchange: 'Coinbase',
        format: 'price',
        minmov: 1,
        pricescale: getPriceScale(symbolName),
        has_intraday: true,
        has_daily: true,
        has_weekly_and_monthly: false,
        supported_resolutions: SUPPORTED_RESOLUTIONS,
        volume_precision: 2,
        data_status: 'streaming',
      }),
    )
  },
  getBars: async (
    symbolInfo: any,
    resolution: string,
    periodParams: any,
    onHistoryCallback: any,
    onErrorCallback: any,
  ) => {
    const { from, to, firstDataRequest } = periodParams
    const mapping = symbolToProduct[symbolInfo.ticker]
    if (!mapping) {
      onErrorCallback(`Cannot resolve symbol ${symbolInfo.ticker}`)
      return
    }

    const granularity = resolutionToGranularity(resolution)
    const chunk = granularity * MAX_CANDLES_PER_REQUEST

    try {
      const bars: Bar[] = []
      // Walk backwards from `to`: Coinbase returns the newest candles when the
      // requested range exceeds 300, so paging back is what fills history.
      let end = to
      for (let i = 0; i < MAX_REQUESTS && end > from; i++) {
        const start = Math.max(from, end - chunk)
        const url = `${API_ENDPOINT}/products/${mapping.product}/candles?granularity=${granularity}&start=${start}&end=${end}`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Coinbase candles ${response.status}`)
        }
        const candles: Candle[] = await response.json()
        if (candles.length === 0) break
        bars.unshift(...candlesToBars(candles, mapping.inverted ?? false))
        end = start
      }

      if (firstDataRequest && bars.length > 0) {
        lastBarsCache.set(symbolInfo.ticker, bars[bars.length - 1])
      }

      onHistoryCallback(bars, { noData: bars.length === 0 })
    } catch (error) {
      console.log('[getBars]: Get error', error)
      onErrorCallback(error)
    }
  },
  subscribeBars: (
    symbolInfo: any,
    resolution: string,
    onRealtimeCallback: any,
    subscriberUID: any,
    onResetCacheNeededCallback: any,
  ) => {
    const mapping = symbolToProduct[symbolInfo.ticker]
    if (!mapping) return
    subscribeOnStream(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscriberUID,
      onResetCacheNeededCallback,
      lastBarsCache.get(symbolInfo.ticker),
      mapping,
    )
  },
  unsubscribeBars: (subscriberUID: any) => {
    unsubscribeFromStream(subscriberUID)
  },
}

export default datafeed
