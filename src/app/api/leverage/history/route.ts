import { CoingeckoProvider, CoinGeckoService } from '@indexcoop/analytics-sdk'
import { uniqBy } from 'lodash'
import { NextRequest, NextResponse } from 'next/server'
import { Address } from 'viem'

import {
  GetApiV2UserAddressPositionsQueryParamsChainIdEnum as ApiChainId,
  getApiV2UserAddressPositions,
  GetApiV2UserAddressPositions200,
} from '@/gen'

type TokenTransferRequest = {
  user: Address
  chainId: number
}

const calculateAverageEntryPrice = (
  positions: GetApiV2UserAddressPositions200,
) => {
  // TODO: should probably throw out the type === 'sell' transactions.
  const grouped = positions.reduce(
    (acc, position) => {
      if (position.trade && position.metrics) {
        const tokenAddress = position.metrics.tokenAddress

        if (!acc[tokenAddress]) {
          acc[tokenAddress] = { sum: 0, count: 0 }
        }

        acc[tokenAddress].sum += position.trade.underlyingAssetUnitPrice ?? 0
        acc[tokenAddress].count += 1
      }
      return acc
    },
    {} as Record<string, { sum: number; count: number }>,
  )

  const averages = Object.keys(grouped).reduce(
    (acc, tokenAddress) => {
      acc[tokenAddress] =
        grouped[tokenAddress].sum / grouped[tokenAddress].count
      return acc
    },
    {} as Record<string, number>,
  )

  return averages
}

export async function POST(req: NextRequest) {
  try {
    const { user, chainId } = (await req.json()) as TokenTransferRequest

    const positions = await getApiV2UserAddressPositions(
      { address: user },
      { chainId: chainId.toString() as ApiChainId },
    )

    const history = positions.data.sort(
      (a, b) =>
        new Date(b.metadata.blockTimestamp).getTime() -
        new Date(a.metadata.blockTimestamp).getTime(),
    )

    const openPositions = history.filter(
      (position) =>
        position.trade &&
        position.metrics &&
        position.metrics.positionStatus === 'open',
    )

    const averages = calculateAverageEntryPrice(openPositions)

    const open = uniqBy(
      openPositions.map((position) => ({
        ...position,
        trade: {
          ...position.trade,
          underlyingAssetUnitPrice: averages[position.metrics!.tokenAddress],
        },
      })),
      'metrics.tokenAddress',
    )

    const coingeckoService = new CoinGeckoService(
      process.env.COINGECKO_API_KEY!,
    )
    const provider = new CoingeckoProvider(coingeckoService)

    const stats = await Promise.all(
      open.map(async (position) =>
        provider.getTokenStats(
          position.trade?.underlyingAssetSymbol ?? '',
          position.trade?.underlyingAssetUnitPriceDenominator?.toLowerCase() ??
            'usd',
        ),
      ),
    )

    return NextResponse.json(
      { open, history, stats },
      {
        status: 200,
        headers: {
          // Response will be cached for 5 seconds, and will serve stale content while revalidating for 10 seconds
          'Cache-Control': 'public, max-age=5, stale-while-revalidate=10',
        },
      },
    )
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
