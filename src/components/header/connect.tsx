'use client'

import { useEffect } from 'react'

import { useAccount } from 'wagmi'

import { ConnectButton } from '@rainbow-me/rainbowkit'

import { useNetwork } from '@/lib/hooks/use-network'
import { useAnalytics } from '@/lib/hooks/use-analytics'

export const Connect = () => {
  const { address } = useAccount()
  const { chainId } = useNetwork()
  const { logConnectWallet } = useAnalytics()

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
