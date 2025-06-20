import {
  getTokenByChainAndAddress,
  getTokenByChainAndSymbol,
  isYieldToken,
} from '@indexcoop/tokenlists'
import { uniqBy } from 'lodash'
import mapKeys from 'lodash/mapKeys'
import { NextRequest, NextResponse } from 'next/server'
import { Address } from 'viem'

import { calculateAverageEntryPrice } from '@/app/leverage/utils/fetch-leverage-token-prices'
import {
  getApiV2PriceCoingeckoSimplePrice,
  getApiV2UserAddressPositions,
} from '@/gen'

type TokenTransferRequest = {
  user: Address
}

const fetchCoingeckoPrices = async (
  ids: string[],
  vs_currencies: string[],
): Promise<Record<string, { [key: string]: number }>> => {
  const response = await getApiV2PriceCoingeckoSimplePrice({
    ids: ids.join(','),
    vs_currencies: vs_currencies.join(','),
  })
  return response.data
}

const mapCoingeckoIdToSymbol = (id: string) => {
  switch (id) {
    case 'ethereum':
      return 'eth'
    case 'bitcoin':
      return 'btc'
    case 'wrapped-solana-universal':
      return 'sol'
    case 'wrapped-sui-universal':
      return 'sui'
    default:
      return id
  }
}

const wsteth = getTokenByChainAndSymbol(8453, 'wstETH')

export async function POST(req: NextRequest) {
  try {
    const { user } = (await req.json()) as TokenTransferRequest

    const { data: positions } = await getApiV2UserAddressPositions({
      address: user,
    })

    const history = positions
      .filter(({ rawContract }) => {
        const token1 = getTokenByChainAndAddress(1, rawContract.address)
        const token8453 = getTokenByChainAndAddress(8453, rawContract.address)
        const token42161 = getTokenByChainAndAddress(42161, rawContract.address)

        return (
          isYieldToken(token1) ||
          isYieldToken(token8453) ||
          isYieldToken(token42161)
        )
      })
      .sort(
        (a, b) =>
          new Date(b.metadata.blockTimestamp).getTime() -
          new Date(a.metadata.blockTimestamp).getTime(),
      )

    let prices: Record<string, { [key: string]: number }> = {}
    try {
      prices = mapKeys(
        await fetchCoingeckoPrices(
          ['ethereum', 'bitcoin', wsteth?.extensions.coingeckoId].filter(
            (str) => str !== undefined,
          ),
          ['btc', 'eth', 'usd'],
        ),
        (_, key) => mapCoingeckoIdToSymbol(key),
      )
    } catch (error) {
      console.log(JSON.stringify(error, null, 2))
      console.error('Failed to fetch coingecko prices', error)
    }

    const openPositions = history.filter(
      (position) => position.metrics?.positionStatus === 'open',
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

    return NextResponse.json(
      { open, history, stats: prices },
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
