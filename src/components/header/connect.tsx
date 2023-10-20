import { useEffect } from 'react'

import { useAccount } from 'wagmi'

import { ConnectButton } from '@rainbow-me/rainbowkit'

import { useLedgerStatus } from '@/lib/hooks/useLedgerStatus'
import { useNetwork } from '@/lib/hooks/useNetwork'
import { logConnect } from '@/lib/utils/api/analytics'

export const Connect = () => {
  const { address } = useAccount()
  const { chainId } = useNetwork()
  const { isRunningInLedgerLive } = useLedgerStatus()

  useEffect(() => {
    if (address === undefined || chainId === undefined) return
    logConnect(address, chainId)
  }, [address, chainId])

  const chainStatus = isRunningInLedgerLive
    ? { smallScreen: 'none', largeScreen: 'none' }
    : { smallScreen: 'full', largeScreen: 'full' }

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
