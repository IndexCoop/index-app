// Template pulled from https://github.com/cctdaniel/pyth-tv-charting-lib/blob/6adfdfcd0c4cf9c503ab154d4d4570a634a0ddbe/src/utils/datafeed.js
import {
  subscribeOnStream,
  unsubscribeFromStream,
} from '@/app/leverage/utils/streaming'

const API_ENDPOINT = 'https://benchmarks.pyth.network/v1/shims/tradingview'

// Use it to keep a record of the most recent bar on the chart
const lastBarsCache = new Map()

const symbolToPriceScale: Record<string, number> = {
  BTCUSD: 100,
  ETHUSD: 100,
  SOLUSD: 100,
  SUIUSD: 10000,
  BTCETH: 10000,
  ETHBTC: 10000,
}

const getPriceScale = (symbol: string) => {
  return symbolToPriceScale[symbol] ?? 100
}

const datafeed = {
  onReady: (callback: any) => {
    fetch(`${API_ENDPOINT}/config`).then((response) => {
      response.json().then((configurationData) => {
        setTimeout(() => callback(configurationData))
      })
    })
  },
  searchSymbols: (
    userInput: any,
    exchange: any,
    symbolType: any,
    onResultReadyCallback: any,
  ) => {
    fetch(`${API_ENDPOINT}/search?query=${userInput}`).then((response) => {
      response.json().then((data) => {
        onResultReadyCallback(data)
      })
    })
  },
  resolveSymbol: (
    symbolNameParam: any,
    onSymbolResolvedCallback: any,
    onResolveErrorCallback: any,
  ) => {
    const symbolName = symbolNameParam === 'BTCETH' ? 'ETHBTC' : symbolNameParam
    fetch(`${API_ENDPOINT}/symbols?symbol=${symbolName}`).then((response) => {
      response
        .json()
        .then((symbolInfoParam) => {
          const symbolInfo =
            symbolNameParam === 'BTCETH'
              ? {
                  ...symbolInfoParam,
                  base_name: ['BTCETH'],
                  description: 'BITCOIN / ETHEREUM',
                  full_name: 'Crypto.BTC/ETH',
                  legs: ['BTCETH'],
                  name: 'BTCETH',
                  pricescale: getPriceScale(symbolNameParam),
                  pro_name: 'Crypto.BTC/ETH',
                  ticker: 'Crypto.BTC/ETH',
                }
              : {
                  ...symbolInfoParam,
                  pricescale: getPriceScale(symbolNameParam),
                }
          onSymbolResolvedCallback(symbolInfo)
        })
        .catch(() => {
          console.log('[resolveSymbol]: Cannot resolve symbol', symbolName)
          onResolveErrorCallback('Cannot resolve symbol')
          return
        })
    })
  },
  getBars: (
    symbolInfo: any,
    resolution: any,
    periodParams: any,
    onHistoryCallback: any,
    onErrorCallback: any,
  ) => {
    const { from, to, firstDataRequest } = periodParams

    const maxRangeInSeconds = 365 * 24 * 60 * 60 // 1 year in seconds

    const promises = []
    let currentFrom = from
    let currentTo

    const isBTCETH = symbolInfo.ticker === 'Crypto.BTC/ETH'
    while (currentFrom < to) {
      currentTo = Math.min(to, currentFrom + maxRangeInSeconds)
      const url = `${API_ENDPOINT}/history?symbol=${isBTCETH ? 'Crypto.ETH/BTC' : symbolInfo.ticker}&from=${currentFrom}&to=${currentTo}&resolution=${resolution}`
      promises.push(fetch(url).then((response) => response.json()))
      currentFrom = currentTo
    }

    Promise.all(promises)
      .then((results) => {
        const bars: any[] = []
        results.forEach((data) => {
          if (data.t.length > 0) {
            data.t.forEach((time: any, index: number) => {
              bars.push({
                time: time * 1000,
                low: isBTCETH ? 1 / data.l[index] : data.l[index],
                high: isBTCETH ? 1 / data.h[index] : data.h[index],
                open: isBTCETH ? 1 / data.o[index] : data.o[index],
                close: isBTCETH ? 1 / data.c[index] : data.c[index],
              })
            })
          }
        })

        if (firstDataRequest && bars.length > 0) {
          lastBarsCache.set(symbolInfo.ticker, {
            ...bars[bars.length - 1],
          })
        }

        onHistoryCallback(bars, { noData: bars.length === 0 })
      })
      .catch((error) => {
        console.log('[getBars]: Get error', error)
        onErrorCallback(error)
      })
  },
  subscribeBars: (
    symbolInfo: any,
    resolution: any,
    onRealtimeCallback: any,
    subscriberUID: any,
    onResetCacheNeededCallback: any,
  ) => {
    subscribeOnStream(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscriberUID,
      onResetCacheNeededCallback,
      lastBarsCache.get(symbolInfo.ticker),
    )
  },
  unsubscribeBars: (subscriberUID: any) => {
    unsubscribeFromStream(subscriberUID)
  },
}

export default datafeed
