import { BigNumber } from 'set.js'

import { useEthers, useTokenBalance } from '@usedapp/core'

import { OPTIMISM, POLYGON } from 'constants/chains'
import { Token } from 'constants/tokens'
import { displayFromWei } from 'utils'

export const useFormattedBalance = (token: Token): string => {
  const { account, chainId } = useEthers()
  const mainnetBalance =
    useTokenBalance(token.address, account) || BigNumber.from(0)
  const polygonBalance =
    useTokenBalance(token.polygonAddress, account) || BigNumber.from(0)
  const optimismBalance =
    useTokenBalance(token.optimismAddress, account) || BigNumber.from(0)
  switch (chainId) {
    case POLYGON.chainId:
      return displayFromWei(polygonBalance, token.decimals) || '0'
    case OPTIMISM.chainId:
      return displayFromWei(optimismBalance, token.decimals) || '0'
    default:
      return displayFromWei(mainnetBalance, token.decimals) || '0'
  }
}
