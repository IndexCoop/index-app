// Template pulled from https://github.com/cctdaniel/pyth-tv-charting-lib/blob/6adfdfcd0c4cf9c503ab154d4d4570a634a0ddbe/src/utils/streaming.js
const streamingUrl =
  'https://benchmarks.pyth.network/v1/shims/tradingview/streaming'
const channelToSubscription = new Map()

function handleStreamingData(data: any) {
  const { id, p, t } = data

  const tradePrice = p
  const tradeTime = t * 1000 // Multiplying by 1000 to get milliseconds

  const channelString = id
  const subscriptionItem = channelToSubscription.get(channelString)

  if (!subscriptionItem) {
    return
  }

  const lastDailyBar = subscriptionItem.lastDailyBar
  const nextDailyBarTime = getNextDailyBarTime(lastDailyBar.time)

  let bar
  if (tradeTime >= nextDailyBarTime) {
    bar = {
      time: nextDailyBarTime,
      open: tradePrice,
      high: tradePrice,
      low: tradePrice,
      close: tradePrice,
    }
  } else {
    bar = {
      ...lastDailyBar,
      high: Math.max(lastDailyBar.high, tradePrice),
      low: Math.min(lastDailyBar.low, tradePrice),
      close: tradePrice,
    }
  }

  subscriptionItem.lastDailyBar = bar

  // Send data to every subscriber of that symbol
  subscriptionItem.handlers.forEach((handler: any) => handler.callback(bar))
  channelToSubscription.set(channelString, subscriptionItem)
}

function startStreaming(retries = 3, delay = 3000) {
  fetch(streamingUrl)
    .then((response) => {
      const reader = response.body!.getReader()

      function streamData() {
        reader
          .read()
          .then(({ value, done }) => {
            if (done) {
              console.error('[stream] Streaming ended.')
              return
            }

            // Assuming the streaming data is separated by line breaks
            const dataStrings = new TextDecoder().decode(value).split('\n')
            dataStrings.forEach((dataString) => {
              const trimmedDataString = dataString.trim()
              if (trimmedDataString) {
                try {
                  const jsonData = JSON.parse(trimmedDataString)
                  handleStreamingData(jsonData)
                  if (jsonData.id === 'Crypto.ETH/BTC') {
                    handleStreamingData({
                      ...jsonData,
                      id: 'Crypto.BTC/ETH',
                      p: 1 / jsonData.p,
                    })
                  }
                } catch (e: any) {
                  console.error('Error parsing JSON:', e.message)
                }
              }
            })

            setTimeout(streamData, 3000) // Continue processing the stream
          })
          .catch((error) => {
            console.error('[stream] Error reading from stream:', error)
            attemptReconnect(retries, delay)
          })
      }

      streamData()
    })
    .catch((error) => {
      console.error(
        '[stream] Error fetching from the streaming endpoint:',
        error,
      )
    })
  function attemptReconnect(retriesLeft: any, delay: any) {
    if (retriesLeft > 0) {
      setTimeout(() => {
        startStreaming(retriesLeft - 1, delay)
      }, delay)
    } else {
      console.error('[stream] Maximum reconnection attempts reached.')
    }
  }
}

function getNextDailyBarTime(barTime: any) {
  const date = new Date(barTime * 1000)
  date.setDate(date.getDate() + 1)
  return date.getTime() / 1000
}

export function subscribeOnStream(
  symbolInfo: any,
  resolution: any,
  onRealtimeCallback: any,
  subscriberUID: any,
  onResetCacheNeededCallback: any,
  lastDailyBar: any,
) {
  const channelString = symbolInfo.ticker
  const handler = {
    id: subscriberUID,
    callback: onRealtimeCallback,
  }
  let subscriptionItem = channelToSubscription.get(channelString)
  subscriptionItem = {
    subscriberUID,
    resolution,
    lastDailyBar,
    handlers: [handler],
  }
  channelToSubscription.set(channelString, subscriptionItem)

  // Start streaming when the first subscription is made
  startStreaming()
}

export function unsubscribeFromStream(subscriberUID: any) {
  // Find a subscription with id === subscriberUID
  for (const channelString of channelToSubscription.keys()) {
    const subscriptionItem = channelToSubscription.get(channelString)
    const handlerIndex = subscriptionItem.handlers.findIndex(
      (handler: any) => handler.id === subscriberUID,
    )

    if (handlerIndex !== -1) {
      // Unsubscribe from the channel if it is the last handler
      channelToSubscription.delete(channelString)
      break
    }
  }
}
