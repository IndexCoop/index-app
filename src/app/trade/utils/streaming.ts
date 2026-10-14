import { type Bar, resolutionToGranularity } from '@/app/trade/utils/datafeed'

const STREAMING_URL = 'wss://ws-feed.exchange.coinbase.com'

type Subscription = {
  subscriberUID: string
  product: string
  inverted: boolean
  granularity: number
  lastBar?: Bar
  handlers: { id: string; callback: (bar: Bar) => void }[]
}

// Keyed by TradingView ticker.
const channelToSubscription = new Map<string, Subscription>()

let socket: WebSocket | null = null
let reconnectAttempts = 0

// Bucket a trade time (ms) into the open time of its candle.
export const barTimeFor = (timeMs: number, granularity: number) =>
  Math.floor(timeMs / 1000 / granularity) * granularity * 1000

// Fold a trade price into the current bar, or open the next one.
export const nextBar = (
  lastBar: Bar | undefined,
  price: number,
  timeMs: number,
  granularity: number,
): Bar => {
  const time = barTimeFor(timeMs, granularity)
  if (!lastBar || time > lastBar.time) {
    return { time, open: price, high: price, low: price, close: price }
  }
  return {
    ...lastBar,
    high: Math.max(lastBar.high, price),
    low: Math.min(lastBar.low, price),
    close: price,
  }
}

function handleTicker(productId: string, rawPrice: string, isoTime: string) {
  const price = Number(rawPrice)
  if (!Number.isFinite(price) || price === 0) return
  const timeMs = new Date(isoTime).getTime()

  for (const subscription of channelToSubscription.values()) {
    if (subscription.product !== productId) continue
    const bar = nextBar(
      subscription.lastBar,
      subscription.inverted ? 1 / price : price,
      timeMs,
      subscription.granularity,
    )
    subscription.lastBar = bar
    subscription.handlers.forEach((handler) => handler.callback(bar))
  }
}

function subscribedProducts() {
  return [
    ...new Set(
      [...channelToSubscription.values()].map(
        (subscription) => subscription.product,
      ),
    ),
  ]
}

function sendSubscribe() {
  const productIds = subscribedProducts()
  if (socket?.readyState !== WebSocket.OPEN || productIds.length === 0) return
  socket.send(
    JSON.stringify({
      type: 'subscribe',
      product_ids: productIds,
      channels: ['ticker'],
    }),
  )
}

function connect() {
  if (socket && socket.readyState !== WebSocket.CLOSED) {
    sendSubscribe()
    return
  }

  socket = new WebSocket(STREAMING_URL)

  socket.onopen = () => {
    reconnectAttempts = 0
    sendSubscribe()
  }

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      if (data.type === 'ticker' && data.price) {
        handleTicker(data.product_id, data.price, data.time)
      }
    } catch (error) {
      console.error('[stream] Error parsing message:', error)
    }
  }

  socket.onclose = () => {
    socket = null
    // Only reconnect while something is still subscribed.
    if (channelToSubscription.size === 0 || reconnectAttempts >= 5) return
    const delay = 1000 * 2 ** reconnectAttempts
    reconnectAttempts++
    setTimeout(connect, delay)
  }

  socket.onerror = (error) => {
    console.error('[stream] Socket error:', error)
  }
}

export function subscribeOnStream(
  symbolInfo: any,
  resolution: string,
  onRealtimeCallback: any,
  subscriberUID: string,
  _onResetCacheNeededCallback: any,
  lastBar: Bar | undefined,
  mapping: { product: string; inverted?: boolean },
) {
  channelToSubscription.set(symbolInfo.ticker, {
    subscriberUID,
    product: mapping.product,
    inverted: mapping.inverted ?? false,
    granularity: resolutionToGranularity(resolution),
    lastBar,
    handlers: [{ id: subscriberUID, callback: onRealtimeCallback }],
  })
  connect()
}

export function unsubscribeFromStream(subscriberUID: string) {
  for (const [ticker, subscription] of channelToSubscription) {
    if (subscription.handlers.some((handler) => handler.id === subscriberUID)) {
      channelToSubscription.delete(ticker)
      break
    }
  }

  if (channelToSubscription.size === 0) {
    socket?.close()
    socket = null
  } else {
    sendSubscribe()
  }
}
