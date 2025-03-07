import {
  getTokenByChainAndAddress,
  getTokenByChainAndSymbol,
  isLeverageToken,
} from '@indexcoop/tokenlists'
import { uniqBy } from 'lodash'
import mapKeys from 'lodash/mapKeys'
import { NextRequest, NextResponse } from 'next/server'
import { Address } from 'viem'

import { calculateAverageEntryPrice } from '@/app/leverage/utils/fetch-leverage-token-prices'
import {
  GetApiV2UserAddressPositionsQueryParamsChainIdEnum as ApiChainId,
  getApiV2UserAddressPositions,
} from '@/gen'

type TokenTransferRequest = {
  user: Address
  chainId: number
}

const fetchCoingeckoPrices = async (
  ids: string[],
  vs_currencies: string[],
): Promise<Record<string, { [key: string]: number }>> => {
  const url = `https://pro-api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=${vs_currencies.join(',')}`
  const options = {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'x-cg-pro-api-key': process.env.COINGECKO_API_KEY!,
    },
  }

  const response = await fetch(url, options)
  const result = await response.json()

  return result
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

export async function POST(req: NextRequest) {
  try {
    const { user, chainId } = (await req.json()) as TokenTransferRequest

    const USUI = getTokenByChainAndSymbol(chainId, 'uSUI')
    const USOL = getTokenByChainAndSymbol(chainId, 'uSOL')

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

    let prices: Record<string, { [key: string]: number }> = {}
    try {
      prices = mapKeys(
        await fetchCoingeckoPrices(
          [
            'ethereum',
            'bitcoin',
            USUI?.extensions.coingeckoId,
            USOL?.extensions.coingeckoId,
          ].filter((str) => str !== undefined),
          ['btc', 'eth', 'usd'],
        ),
        (_, key) => mapCoingeckoIdToSymbol(key),
      )
    } catch (error) {
      console.error('Failed to fetch coingecko prices', error)
    }

    const stats = open.reduce(
      (acc, position) => ({
        ...acc,
        [`${position.trade.underlyingAssetSymbol}-${position.trade.underlyingAssetUnitPriceDenominator}`]:
          prices[position.trade.underlyingAssetSymbol!.toLowerCase()][
            position.trade.underlyingAssetUnitPriceDenominator!.toLowerCase()
          ] ?? 0,
      }),
      {},
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
