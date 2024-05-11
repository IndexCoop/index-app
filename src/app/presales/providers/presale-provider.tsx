import { useEffect, useMemo, useState } from 'react'

import { Token, WSTETH } from '@/constants/tokens'
import { formatAmount, formatWei } from '@/lib/utils'
import { IndexApi } from '@/lib/utils/api/index-api'

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
  const daysLeft: number = Math.ceil(
    Math.abs(timeDifference / millisecondsInDay),
  )
  return daysLeft
}

export function usePresaleData(symbol: string): PresaleData {
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
      try {
        const indexApi = new IndexApi()
        const res = await indexApi.get(`/${presaleToken.symbol}/supply`)
        setTvl(BigInt(res.supply))
      } catch (err) {
        console.log('Error fetching tvl', err)
      }
    }
    fetchTvl()
  }, [presaleToken])

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
