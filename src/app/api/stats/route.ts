import { CoingeckoProvider, CoinGeckoService } from '@indexcoop/analytics-sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const symbol = searchParams.get('symbol')
  const baseCurrency = searchParams.get('baseCurrency')
  if (!symbol || !baseCurrency) {
    return NextResponse.json('Bad Request', { status: 400 })
  }
  try {
    const coingeckoService = new CoinGeckoService(
      process.env.COINGECKO_API_KEY!,
    )
    const provider = new CoingeckoProvider(coingeckoService)
    const data = await provider.getTokenStats(symbol, baseCurrency)
    return NextResponse.json({ ...data })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
