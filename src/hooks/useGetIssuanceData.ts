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

  getZeroExTradeData(false, sellToken, buyToken, amount, chainId || 1).then(
    (data) => {
      setZeroExTradeData(data)
    }
  )
  return zeroExTradeData
}
