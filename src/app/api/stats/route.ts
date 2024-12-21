import { CoingeckoProvider, CoinGeckoService } from '@indexcoop/analytics-sdk'
import { NextRequest, NextResponse } from 'next/server'

import { fetchCarryCosts } from '@/lib/utils/fetch'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const symbol = searchParams.get('symbol')
  const base = searchParams.get('base')
  const baseCurrency = searchParams.get('baseCurrency')
  if (!symbol || !base || !baseCurrency) {
    return NextResponse.json('Bad Request', { status: 400 })
  }
  try {
    const coingeckoService = new CoinGeckoService(
      process.env.COINGECKO_API_KEY!,
    )
    const provider = new CoingeckoProvider(coingeckoService)
    const data = await provider.getTokenStats(base, baseCurrency)
    const carryCosts = await fetchCarryCosts()
    const costOfCarry = carryCosts
      ? carryCosts[symbol.toLowerCase()] ?? null
      : null
    return NextResponse.json({
      base: { ...data, baseCurrency },
      token: { symbol, costOfCarry },
    })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
