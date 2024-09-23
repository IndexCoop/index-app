'use client'

import { ChevronDownIcon } from '@chakra-ui/icons'
import { Button } from '@headlessui/react'
import { useAppKit } from '@reown/appkit/react'
import { CoreHelperUtil } from '@reown/appkit-core'
import { AvatarGenerator } from 'random-avatar-generator'
import { useEffect, useState } from 'react'
import { formatUnits } from 'viem'
import { useAccount, useAccountEffect, useBalance } from 'wagmi'

import { NetworkSelect } from '@/components/header/network-select'
import { useAnalytics } from '@/lib/hooks/use-analytics'
import { shortenAddress } from '@/lib/utils'

const avatarGenerator = new AvatarGenerator()

export const Connect = () => {
  const { address, isConnected, isConnecting } = useAccount()
  const { open } = useAppKit()
  const { logConnectWallet } = useAnalytics()
  const [mounted, setMounted] = useState(false)

  const { data: balance } = useBalance({
    query: {
      initialData: {
        value: BigInt(0),
        decimals: 18,
        symbol: 'ETH',
        formatted: '0',
      },
    },
    address,
  })

  useAccountEffect({
    onConnect: ({ address, chainId }) => {
      logConnectWallet(address, chainId)
    },
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className='text-ic-white flex gap-4 font-bold'>
      {isConnected && address ? (
        <>
          <NetworkSelect />
          <Button
            suppressHydrationWarning
            className='bg-ic-black flex items-center gap-2 rounded-md px-4 py-2'
            onClick={() => open({ view: 'Account' })}
          >
            <p className='hidden md:block'>
              {CoreHelperUtil.formatBalance(
                formatUnits(balance!.value, balance!.decimals),
                balance!.symbol,
              )}
            </p>
            {/*  Here the Image component doesnt work with configuring the host for some reason */}
            <img
              src={avatarGenerator.generateRandomAvatar(address)}
              alt=''
              width={24}
              height={24}
            />
            <p className='hidden md:block'>{shortenAddress(address)}</p>
            <ChevronDownIcon className='h-6 w-6' />
          </Button>
        </>
      ) : (
        <Button
          suppressHydrationWarning
          className='bg-ic-blue-500 rounded-md px-4 py-2'
          onClick={() => open({ view: 'Connect' })}
        >
          {isConnecting ? <p>Connecting...</p> : <p>Connect</p>}
        </Button>
      )}
    </div>
  )
}
