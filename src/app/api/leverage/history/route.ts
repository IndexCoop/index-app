import { AssetTransfersWithMetadataResult } from 'alchemy-sdk'
import { NextRequest, NextResponse } from 'next/server'
import { Address, createPublicClient, http, zeroAddress } from 'viem'
import * as chains from 'viem/chains'

import { getLeverageAction } from '@/app/leverage/utils/get-leverage-type'
import { isContract } from '@/lib/utils'
import { fetchTokenTransfers } from '@/lib/utils/api/alchemy'
import { getAlchemyBaseUrl } from '@/lib/utils/urls'

type TokenTransferRequest = {
  user: Address
  tokens: string[]
  chainId: number
}

export async function POST(req: NextRequest) {
  try {
    const { user, tokens, chainId } = (await req.json()) as TokenTransferRequest

    const chain = Object.values(chains).find((chain) => chain.id === chainId)

    const client = createPublicClient({
      batch: {
        multicall: {
          batchSize: 100,
          wait: 1000,
        },
      },
      transport: http(
        chain?.rpcUrls.default.http[0] ??
          `${getAlchemyBaseUrl(chainId)}${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
      ),
    })

    const transfers = await fetchTokenTransfers(user, tokens, chainId, {
      connectionInfoOverrides: {
        skipFetchSetup: true,

        headers: {
          origin: req.headers.get('origin') || '',
        },
      },
    })

    const transformedTransfers: (AssetTransfersWithMetadataResult & {
      action: ReturnType<typeof getLeverageAction>
    })[] = await Promise.all(
      transfers.map(async (transfer) => {
        const isMint = transfer.from === zeroAddress
        const isBurn = transfer.to === zeroAddress
        const isFromUser = transfer.from === user?.toLowerCase()
        const isToUser = transfer.to === user?.toLowerCase()

        const isFromContract = await isContract(client, transfer.from)
        const isToContract = await isContract(client, transfer.to!)

        const action = getLeverageAction({
          isMint,
          isBurn,
          isFromContract,
          isToContract,
          isFromUser,
          isToUser,
        })

        return {
          ...transfer,
          action,
        }
      }),
    )

    return NextResponse.json(transformedTransfers, {
      status: 200,
      headers: {
        // Response will be cached for 5 seconds, and will serve stale content while revalidating for 10 seconds
        'Cache-Control': 'public, max-age=5, stale-while-revalidate=10',
      },
    })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
