import * as Sentry from '@sentry/nextjs'
import { useEffect, useMemo, useState } from 'react'
import { Address, formatUnits, isAddress } from 'viem'
import { usePublicClient } from 'wagmi'

import { formatTvl } from '@/app/products/utils/formatters'
import { Token, WSTETH } from '@/constants/tokens'
import { formatAmount, formatWei } from '@/lib/utils'
import {
  IndexDataMetric,
  IndexDataProvider,
} from '@/lib/utils/api/index-data-provider'

import { PresaleTokenAbi } from '../abis/presale-token-abi'
import { preSaleTokens } from '../constants'
import { PreSaleStatus } from '../types'

interface PresaleData {
  currencyToken: Token
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

  const [tvl, setTvl] = useState<number>(0)

  const daysLeft = useMemo(() => {
    if (!presaleToken) return '-'
    return getDaysLeft(presaleToken.timestampEndDate).toString()
  }, [presaleToken])

  const tvlFormatted = useMemo(() => {
    if (!presaleToken) return ''
    if (presaleToken.status === PreSaleStatus.CLOSED_TARGET_NOT_MET)
      return presaleToken.tvlLockedPresale ?? ''
    if (presaleToken.status === PreSaleStatus.TOKEN_LAUNCHED)
      return formatTvl(tvl)

    return `${formatAmount(Number(formatWei(BigInt(tvl), currencyToken.decimals)))} ${currencyToken.symbol}`
  }, [currencyToken, presaleToken, tvl])

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

      const indexDataProvider = new IndexDataProvider()
      if (presaleToken.status === PreSaleStatus.TOKEN_LAUNCHED) {
        try {
          const res = await indexDataProvider.getTokenMetrics({
            tokenAddress: presaleToken.address!,
            metrics: [IndexDataMetric.Pav],
          })

          if (!res?.pav) return

          setTvl(res.pav)
        } catch (err) {
          console.log('Error fetching marketcap tvl', err)
        }
      } else if (presaleToken.status !== PreSaleStatus.CLOSED_TARGET_NOT_MET) {
        try {
          const res = await indexDataProvider.getTokenMetrics({
            tokenAddress: presaleToken.address!,
            metrics: [IndexDataMetric.Supply],
          })

          if (!res?.supply) return

          const realUnitsRes = await publicClient.readContract({
            address: presaleToken.address as Address,
            abi: PresaleTokenAbi,
            functionName: 'getTotalComponentRealUnits',
            args: [currencyToken.address as Address],
          })
          setTvl(
            res.supply *
              Number(formatUnits(realUnitsRes, presaleToken.decimals)),
          )
        } catch (err) {
          console.log('Error fetching supply tvl', err)
        }
      }
    }
    fetchTvl()
  }, [publicClient, presaleToken, currencyToken])

  return {
    currencyToken,
    formatted: {
      daysLeft,
      tvl: tvlFormatted,
    },
  }
}
