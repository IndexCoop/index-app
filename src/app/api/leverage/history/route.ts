import { CoingeckoProvider, CoinGeckoService } from '@indexcoop/analytics-sdk'
import {
  getTokenByChainAndAddress,
  isLeverageToken,
} from '@indexcoop/tokenlists'
import { uniqBy } from 'lodash'
import { UnwrapPromise } from 'next/dist/lib/coalesced-function'
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
      if (
        position.trade &&
        position.metrics &&
        position.trade.transactionType === 'buy'
      ) {
        const tokenAddress = position.metrics.tokenAddress

        if (!acc[tokenAddress]) {
          acc[tokenAddress] = { sum: 0, count: 0 }
        }

        acc[tokenAddress].sum +=
          (position.trade.underlyingAssetUnitPrice ?? 0) *
          (position.metrics.endingUnits ?? 0)
        acc[tokenAddress].count += position.metrics.endingUnits ?? 0
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

    const history = positions.data
      .filter(({ rawContract }) => {
        const token = getTokenByChainAndAddress(chainId, rawContract.address)

        return isLeverageToken(token)
      })
      .sort(
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

    const stats = (
      await Promise.all(
        open.map(async (position) => {
          if (position.trade) {
            try {
              const stats = await provider.getTokenStats(
                position.trade.underlyingAssetSymbol ?? '',
                position.trade.underlyingAssetUnitPriceDenominator?.toLowerCase() ??
                  'usd',
              )

              return {
                asset: `${position.trade.underlyingAssetSymbol}-${position.trade.underlyingAssetUnitPriceDenominator}`,
                stats,
              }
            } catch (error) {
              console.log(JSON.stringify({ error, stats }, null, 2))

              return {
                asset: `${position.trade.underlyingAssetSymbol}-${position.trade.underlyingAssetUnitPriceDenominator}`,
                stats: {} as UnwrapPromise<
                  ReturnType<typeof provider.getTokenStats>
                >,
              }
            }
          }
        }),
      )
    ).reduce(
      (acc, curr) => {
        if (curr?.asset) {
          acc[curr.asset] = curr.stats
        }
        return acc
      },
      {} as Record<
        string,
        UnwrapPromise<ReturnType<typeof provider.getTokenStats>>
      >,
    )

    return NextResponse.json(
      { open, history, stats },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=1, stale-while-revalidate=1',
        },
      },
    )
  } catch (error) {
    console.log(JSON.stringify(error, null, 2))
    return NextResponse.json(error, { status: 500 })
  }
}
