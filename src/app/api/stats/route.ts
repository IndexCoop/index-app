import { CoinGeckoService, CoingeckoProvider } from '@indexcoop/analytics-sdk'
import { headers } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { fetchTokenMetrics } from '@/lib/utils/api/index-data-provider'
import { fetchCarryCosts } from '@/lib/utils/fetch'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const chainId = Number(searchParams.get('chainId'))
  const tokenAddress = searchParams.get('address')
  const symbol = searchParams.get('symbol')
  const base = searchParams.get('base')
  const baseCurrency = searchParams.get('baseCurrency')
  if (!chainId || !tokenAddress || !symbol || !base || !baseCurrency) {
    return NextResponse.json('Bad Request', { status: 400 })
  }
  try {
    const coingeckoService = new CoinGeckoService(
      process.env.COINGECKO_API_KEY!,
    )
    const provider = new CoingeckoProvider(coingeckoService)
    const data = await provider.getTokenStats(base, baseCurrency)
    const carryCosts = await fetchCarryCosts()
    const formattedSymbol = (
      symbol.startsWith('u') ? symbol.slice(1) : symbol
    ).toLowerCase()
    const costOfCarry = carryCosts
      ? (carryCosts[formattedSymbol] ?? null)
      : null

    const headersList = await headers()
    const host = headersList.get('host')
    const metrics = await fetchTokenMetrics({
      hostname:
        process.env.NODE_ENV === 'development'
          ? `http://${host}`
          : `https://${host}`,
      chainId,
      tokenAddress: tokenAddress,
      metrics: ['fees', 'nav', 'navchange'],
    })

    return NextResponse.json({
      base: { ...data, baseCurrency },
      token: {
        symbol,
        costOfCarry,
        nav: metrics?.NetAssetValue ?? 0,
        navchange: metrics?.NavChange24Hr ?? 0,
        streamingFee: metrics?.StreamingFee ?? 0,
      },
    })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
