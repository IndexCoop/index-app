import { useState } from 'react'

import { useEthers } from '@usedapp/core'

import { Token } from 'constants/tokens'
import { getZeroExTradeData, ZeroExData } from 'utils/zeroExUtils'

/**
 * Get the 0x Trade Data for
 */
export const useGetTradeData = (
  sellToken: Token,
  buyToken: Token,
  amount: string
): ZeroExData | undefined => {
  const { chainId } = useEthers()
  const [zeroExTradeData, setZeroExTradeData] = useState<ZeroExData>()

  if (amount.length < 1 || amount === '0') return undefined
  getZeroExTradeData(true, sellToken, buyToken, amount, chainId || 1)
    .catch((error) => console.log(error))
    .then((data) => {
      if (data === undefined) return
      setZeroExTradeData(data)
    })
  return zeroExTradeData
}
