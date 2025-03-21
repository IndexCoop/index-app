import { subscribeOnStream, unsubscribeFromStream } from './streaming'

const API_ENDPOINT = 'https://benchmarks.pyth.network/v1/shims/tradingview'

// Use it to keep a record of the most recent bar on the chart
const lastBarsCache = new Map()

const datafeed = {
  onReady: (callback: any) => {
    console.log('[onReady]: Method call')
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
    console.log('[searchSymbols]: Method call')
    fetch(`${API_ENDPOINT}/search?query=${userInput}`).then((response) => {
      response.json().then((data) => {
        onResultReadyCallback(data)
      })
    })
  },
  resolveSymbol: (
    symbolName: any,
    onSymbolResolvedCallback: any,
    onResolveErrorCallback: any,
  ) => {
    console.log('[resolveSymbol]: Method call', symbolName)
    fetch(`${API_ENDPOINT}/symbols?symbol=${symbolName}`).then((response) => {
      response
        .json()
        .then((symbolInfo) => {
          console.log('[resolveSymbol]: Symbol resolved', symbolInfo)
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
    console.log('[getBars]: Method call', symbolInfo, resolution, from, to)

    const maxRangeInSeconds = 365 * 24 * 60 * 60 // 1 year in seconds

    const promises = []
    let currentFrom = from
    let currentTo

    while (currentFrom < to) {
      currentTo = Math.min(to, currentFrom + maxRangeInSeconds)
      const url = `${API_ENDPOINT}/history?symbol=${symbolInfo.ticker}&from=${currentFrom}&to=${currentTo}&resolution=${resolution}`
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
                low: data.l[index],
                high: data.h[index],
                open: data.o[index],
                close: data.c[index],
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
    console.log(
      '[subscribeBars]: Method call with subscriberUID:',
      subscriberUID,
    )
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
    console.log(
      '[unsubscribeBars]: Method call with subscriberUID:',
      subscriberUID,
    )
    unsubscribeFromStream(subscriberUID)
  },
}

export default datafeed
