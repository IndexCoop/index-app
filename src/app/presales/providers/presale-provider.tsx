import * as Sentry from '@sentry/nextjs'
import { useEffect, useMemo, useState } from 'react'
import { Address, formatUnits, isAddress } from 'viem'
import { usePublicClient } from 'wagmi'

import { Token, WSTETH } from '@/constants/tokens'
import { formatAmount, formatWei } from '@/lib/utils'
import { IndexApi } from '@/lib/utils/api/index-api'

import { PresaleTokenAbi } from '../abis/presale-token-abi'
import { preSaleTokens } from '../constants'

interface PresaleData {
  currencyToken: Token
  data: {
    tvl: bigint
  }
  formatted: {
    daysLeft: string
    tvl: string
  }
}

function getDaysLeft(targetTimestamp: number): number {
  const currentTimestamp: number = Date.now()
  const timeDifference: number = targetTimestamp - currentTimestamp
  const millisecondsInDay: number = 1000 * 60 * 60 * 24
  const daysLeft: number = Math.min(
    Math.ceil(Math.abs(timeDifference / millisecondsInDay)),
    30,
  )
  return daysLeft
}

export function usePresaleData(symbol: string): PresaleData {
  const publicClient = usePublicClient()
  const presaleToken = preSaleTokens.find((token) => token.symbol === symbol)
  const currencyToken = WSTETH

  const [tvl, setTvl] = useState<bigint>(BigInt(0))

  const daysLeft = useMemo(() => {
    if (!presaleToken) return '-'
    return getDaysLeft(presaleToken.timestampEndDate).toString()
  }, [presaleToken])

  const tvlFormatted = useMemo(
    () =>
      `${formatAmount(Number(formatWei(tvl, currencyToken.decimals)))} ${currencyToken.symbol}`,
    [currencyToken, tvl],
  )

  useEffect(() => {
    if (!presaleToken) return
    const fetchTvl = async () => {
      if (!publicClient) return
      if (!isAddress(presaleToken.address ?? '')) {
        Sentry.captureMessage(
          `Presale token address invalid - ${presaleToken.symbol}`,
        )
        return
      }
      if (!isAddress(currencyToken.address ?? '')) {
        Sentry.captureMessage(
          `Currency token address invalid - ${currencyToken.symbol}`,
        )
        return
      }

      try {
        const indexApi = new IndexApi()
        const supplyRes = await indexApi.get(`/${presaleToken.symbol}/supply`)

        // TODO: Handling for after the token launches
        const realUnitsRes = await publicClient.readContract({
          address: presaleToken.address as Address,
          abi: PresaleTokenAbi,
          functionName: 'getTotalComponentRealUnits',
          args: [currencyToken.address as Address],
        })
        setTvl(
          BigInt(
            Number(supplyRes.supply) *
              Number(formatUnits(realUnitsRes, presaleToken.decimals)),
          ),
        )
      } catch (err) {
        console.log('Error fetching tvl', err)
      }
    }
    fetchTvl()
  }, [publicClient, presaleToken, currencyToken])

  return {
    currencyToken,
    data: {
      ...presaleToken,
      tvl,
    },
    formatted: {
      daysLeft,
      tvl: tvlFormatted,
    },
  }
}
