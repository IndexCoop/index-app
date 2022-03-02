import { useEffect, useState } from 'react'

import { BigNumber } from 'set.js'

import { useEthers, useTokenBalance } from '@usedapp/core'

import { MAINNET, POLYGON } from 'constants/chains'
import { Token } from 'constants/tokens'
import { displayFromWei } from 'utils'

export const useFormattedBalance = (token: Token): string => {
  const { account, chainId } = useEthers()
  const [balance, setBalance] = useState(BigNumber.from(0))
  const mainnetBalance =
    useTokenBalance(token.address, account) || BigNumber.from(0)
  const polygonBalance =
    useTokenBalance(token.polygonAddress, account) || BigNumber.from(0)

  console.log(
    'useFormattedBalance',
    token,
    account,
    chainId,
    mainnetBalance.toString(),
    polygonBalance.toString()
  )

  useEffect(() => {
    if (chainId === POLYGON.chainId) {
      setBalance(polygonBalance)
    } else if (chainId === MAINNET.chainId) {
      setBalance(mainnetBalance)
    }
  }, [chainId])

  return displayFromWei(balance, 2, token.decimals) || '0'
}
