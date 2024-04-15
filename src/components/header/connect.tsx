'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect } from 'react'

import { useAnalytics } from '@/lib/hooks/use-analytics'
import { useNetwork } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'

export const Connect = () => {
  const { logConnectWallet } = useAnalytics()
  const { chainId } = useNetwork()
  const { address } = useWallet()

  useEffect(() => {
    if (address === undefined || chainId === undefined) return
    logConnectWallet(address, chainId)
  }, [address, chainId, logConnectWallet])

  const chainStatus = { smallScreen: 'full', largeScreen: 'full' }

  return (
    <ConnectButton
      label='Connect'
      showBalance={{
        smallScreen: false,
        largeScreen: true,
      }}
      accountStatus={{
        smallScreen: 'avatar',
        largeScreen: 'full',
      }}
      chainStatus={chainStatus as any}
    />
  )
}
