'use client'

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

  return <w3m-button label='Connect' balance='show' />
}
