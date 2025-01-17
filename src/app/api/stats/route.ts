import { CoingeckoProvider, CoinGeckoService } from '@indexcoop/analytics-sdk'
import { NextRequest, NextResponse } from 'next/server'

import { fetchTokenMetrics } from '@/lib/utils/api/index-data-provider'
import { fetchCarryCosts } from '@/lib/utils/fetch'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tokenAddress = searchParams.get('address')
  const symbol = searchParams.get('symbol')
  const base = searchParams.get('base')
  const baseCurrency = searchParams.get('baseCurrency')

  if (!tokenAddress || !symbol || !base || !baseCurrency) {
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
      ? (carryCosts[symbol.toLowerCase()] ?? null)
      : null
    const metrics = await fetchTokenMetrics({
      tokenAddress: tokenAddress,
      metrics: ['nav', 'navchange'],
    })

    console.log({ data, baseCurrency, url: req.url })
    return NextResponse.json({
      base: { ...data, baseCurrency },
      token: {
        symbol,
        costOfCarry,
        nav: metrics?.NetAssetValue ?? 0,
        navchange: (metrics?.NavChange24Hr ?? 0) * 100,
      },
    })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
