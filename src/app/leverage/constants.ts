import { getLeverageBaseToken } from '@/app/leverage/utils/get-leverage-base-token'
import { getLeverageType } from '@/app/leverage/utils/get-leverage-type'
import {
  IndexCoopBitcoin2xIndex,
  IndexCoopBitcoin3xIndex,
  IndexCoopEthereum2xIndex,
  IndexCoopEthereum3xIndex,
  IndexCoopInverseBitcoinIndex,
  IndexCoopInverseEthereumIndex,
} from '@/constants/tokens'
import { isAddress } from '@/lib/utils'
import { getAddressForToken } from '@/lib/utils/tokens'

import { LeverageToken } from './types'

export const ethLeverageTokens = [
  IndexCoopEthereum2xIndex,
  IndexCoopEthereum3xIndex,
  IndexCoopInverseEthereumIndex,
]

export const btcLeverageTokens = [
  IndexCoopBitcoin2xIndex,
  IndexCoopBitcoin3xIndex,
  IndexCoopInverseBitcoinIndex,
]

export const leverageTokens = [...ethLeverageTokens, ...btcLeverageTokens]

export function getLeverageTokens(chainId: number): LeverageToken[] {
  const tokens = leverageTokens.map((token) => {
    const baseToken = getLeverageBaseToken(token.symbol)
    const address = getAddressForToken(token, chainId)
    const leverageType = getLeverageType(token.symbol)
    if (
      !baseToken ||
      !address ||
      !isAddress(address) ||
      leverageType === null
    ) {
      return null
    }
    return {
      ...token,
      address,
      baseToken: baseToken.symbol,
      leverageType,
    }
  })
  return tokens.filter((token) => token !== null)
}
