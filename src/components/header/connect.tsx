'use client'

import { ChevronDownIcon } from '@chakra-ui/icons'
import { Button } from '@headlessui/react'
import { useAppKit } from '@reown/appkit/react'
import { CoreHelperUtil } from '@reown/appkit-core'
import { useEffect, useMemo, useState } from 'react'
import { formatUnits } from 'viem'
import { useAccount, useAccountEffect, useBalance } from 'wagmi'

import { NetworkSelect } from '@/components/header/network-select'
import { useAnalytics } from '@/lib/hooks/use-analytics'
import { shortenAddress } from '@/lib/utils'
import { emojiAvatarForAddress } from '@/lib/utils/emojiAddressAvatar'

export const Connect = () => {
  const { address, isConnected } = useAccount()
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

  const avatar = useMemo(() => {
    if (!address) return null

    return emojiAvatarForAddress(address)
  }, [address])

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
            className='bg-ic-black flex items-center gap-2 rounded-md px-4 py-2 transition-all duration-300 hover:scale-[1.04]'
            onClick={() => open({ view: 'Account' })}
          >
            <p className='hidden md:block'>
              {CoreHelperUtil.formatBalance(
                formatUnits(balance!.value, balance!.decimals),
                balance!.symbol,
              )}
            </p>
            {/*  Here the Image component doesnt work with configuring the host for some reason */}
            <div
              className='flex h-6 w-6 items-center justify-center rounded-full'
              style={{ backgroundColor: avatar?.color }}
            >
              {avatar?.emoji}
            </div>
            <p className='hidden md:block'>{shortenAddress(address)}</p>
            <ChevronDownIcon className='h-6 w-6' />
          </Button>
        </>
      ) : (
        <Button
          suppressHydrationWarning
          className='bg-ic-blue-500 hover:bg-ic-blue-500/90 rounded-md px-4 py-2 transition-all duration-300 hover:scale-[1.04]'
          onClick={() => open({ view: 'Connect' })}
        >
          Connect
        </Button>
      )}
    </div>
  )
}
