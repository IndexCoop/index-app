import { useEffect, useMemo, useState } from 'react'

import { Token, WSTETH } from '@/constants/tokens'
import { formatAmount } from '@/lib/utils'
import { IndexApi } from '@/lib/utils/api/index-api'

import { preSaleTokens } from '../constants'

interface PresaleData {
  currencyToken: Token
  data: {
    tvl: number
  }
  formatted: {
    daysLeft: string
    prtRewards: string
    indexRewards: string
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

  const [tvl, setTvl] = useState(0)

  const daysLeft = useMemo(() => {
    if (!presaleToken) return '-'
    return getDaysLeft(presaleToken.timestampEndDate).toString()
  }, [presaleToken])

  const tvlFormatted = useMemo(
    () => `${formatAmount(tvl)} ${currencyToken.symbol}`,
    [currencyToken, tvl],
  )

  useEffect(() => {
    if (!presaleToken) return
    const fetchTvl = async () => {
      try {
        const indexApi = new IndexApi()
        const res = await indexApi.get(`/${presaleToken.symbol}/marketcap`)
        setTvl(res.marketcap)
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
      prtRewards: '',
      indexRewards: '',
      tvl: tvlFormatted,
    },
  }
}
