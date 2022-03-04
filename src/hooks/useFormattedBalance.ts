import { BigNumber } from 'set.js'

import { useEthers, useTokenBalance } from '@usedapp/core'

import { MAINNET } from 'constants/chains'
import { Token } from 'constants/tokens'
import { displayFromWei } from 'utils'

export const useFormattedBalance = (token: Token): string => {
  const { account, chainId } = useEthers()
  const mainnetBalance =
    useTokenBalance(token.address, account) || BigNumber.from(0)
  const polygonBalance =
    useTokenBalance(token.polygonAddress, account) || BigNumber.from(0)
  const balance = chainId === MAINNET.chainId ? mainnetBalance : polygonBalance
  return displayFromWei(balance, 2, token.decimals) || '0'
}
