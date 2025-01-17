import { uniqBy } from 'lodash'
import { NextRequest, NextResponse } from 'next/server'
import { Address } from 'viem'

import {
  GetApiV2UserAddressPositionsQueryParamsChainIdEnum as ApiChainId,
  getApiV2UserAddressPositions,
} from '@/gen'

import { GET as getApiStats } from '../../stats/route'

type TokenTransferRequest = {
  user: Address
  chainId: number
}

export async function POST(req: NextRequest) {
  try {
    const { user, chainId } = (await req.json()) as TokenTransferRequest

    const host = req.headers.get('host')
    const protocol = host?.startsWith('localhost') ? 'http' : 'https'

    const positions = await getApiV2UserAddressPositions(
      { address: user },
      { chainId: chainId.toString() as ApiChainId },
    )

    const history = positions.data.sort(
      (a, b) =>
        new Date(b.metadata.blockTimestamp).getTime() -
        new Date(a.metadata.blockTimestamp).getTime(),
    )

    const open = uniqBy(
      history.filter(
        (position) =>
          position.trade &&
          position.metrics &&
          position.metrics.positionStatus === 'open',
      ),
      'metrics.tokenAddress',
    )

    const marketStats = await Promise.all(
      open.map(async (position) => {
        const url = `${protocol}://${host}/api/stats?address=${position.rawContract.address}&symbol=${position.metrics?.market}&base=${position.trade?.underlyingAssetSymbol}&baseCurrency=${position.trade?.underlyingAssetUnitPriceDenominator}`
        const response = await getApiStats(
          new NextRequest({
            ...req,
            url,
          }),
        )

        console.log(response)

        const data = await response.json()

        return data
      }),
    )

    console.log({ marketStats })

    return NextResponse.json(
      { open, history },
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
