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
  getApiV2PriceCoingeckoSimplePrice,
  getApiV2UserAddressPositions,
  GetApiV2UserAddressPositions200,
} from '@/gen'

type TokenTransferRequest = {
  user: Address
  chainId: number
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
    case 'aave':
      return 'aave'
    case 'arbitrum':
      return 'arb'
    case 'ethereum':
      return 'eth'
    case 'bitcoin':
      return 'btc'
    case 'tether-gold':
      return 'xaut'
    case 'chainlink':
      return 'link'
    case 'wrapped-solana-universal':
      return 'sol'
    case 'wrapped-sui-universal':
      return 'sui'
    case 'wrapped-xrp-universal':
      return 'xrp'
    default:
      return id
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, chainId } = (await req.json()) as TokenTransferRequest

    const USUI = getTokenByChainAndSymbol(chainId, 'uSUI')
    const USOL = getTokenByChainAndSymbol(chainId, 'uSOL')
    const UXRP = getTokenByChainAndSymbol(chainId, 'uXRP')
    const AAVE = getTokenByChainAndSymbol(chainId, 'AAVE')
    const ARB = getTokenByChainAndSymbol(chainId, 'ARB')
    const XAUT = getTokenByChainAndSymbol(chainId, 'XAUt')
    const LINK = getTokenByChainAndSymbol(chainId, 'LINK')

    const { data: positions } = await getApiV2UserAddressPositions(
      { address: user },
      { chainId: chainId.toString() as ApiChainId },
    )

    const history = positions
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
        } as GetApiV2UserAddressPositions200[number]['trade'],
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
            UXRP?.extensions.coingeckoId,
            AAVE?.extensions.coingeckoId,
            ARB?.extensions.coingeckoId,
            XAUT?.extensions.coingeckoId,
            LINK?.extensions.coingeckoId,
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
        ...(position.trade?.underlyingAssetUnitPrice &&
        position.trade?.underlyingAssetUnitPriceDenominator &&
        position.trade?.underlyingAssetSymbol
          ? {
              [`${position.trade.underlyingAssetSymbol}-${position.trade.underlyingAssetUnitPriceDenominator}`]:
                prices[position.trade.underlyingAssetSymbol.toLowerCase()][
                  position.trade.underlyingAssetUnitPriceDenominator.toLowerCase()
                ],
            }
          : {}),
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
