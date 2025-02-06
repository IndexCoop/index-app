import { CoinGeckoService, CoingeckoProvider } from '@indexcoop/analytics-sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const symbol = searchParams.get('symbol')
  const currency = searchParams.get('currency')
  if (!symbol || !currency) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  }
  try {
    const coingeckoService = new CoinGeckoService(
      process.env.COINGECKO_API_KEY!,
    )
    const provider = new CoingeckoProvider(coingeckoService)

    const data = await provider.getTokenStats(symbol, currency.toLowerCase())
    return NextResponse.json({
      symbol,
      currency,
      market: `${symbol} / ${currency}`,
      change24h: data.change24h,
      price: data.price,
    })
  } catch (error) {
    console.error('Error fetching market stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
