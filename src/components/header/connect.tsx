'use client'

import { Button } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useAppKit } from '@reown/appkit/react'
import { useMemo } from 'react'
import { useAccount, useAccountEffect, useBalance } from 'wagmi'

import { NetworkSelect } from '@/components/header/network-select'
import { useAnalytics } from '@/lib/hooks/use-analytics'
import { useNetwork } from '@/lib/hooks/use-network'
import { formatAmountFromWei, shortenAddress } from '@/lib/utils'
import { emojiAvatarForAddress } from '@/lib/utils/emoji-address-avatar'

export const Connect = () => {
  const { address, isConnected, chainId: walletChainId } = useAccount()
  const { chainId } = useNetwork()
  const { open } = useAppKit()
  const { logConnectWallet } = useAnalytics()

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

  return (
    <div className='text-ic-white font-bold'>
      {isConnected && address ? (
        <div className='relative flex items-center gap-4'>
          {chainId !== walletChainId && <div className='absolute'></div>}
          <NetworkSelect />
          <Button
            className='bg-ic-black flex items-center gap-2 rounded-md px-4 py-1 text-sm transition-all duration-300 hover:scale-[1.04]'
            onClick={() => open({ view: 'Account' })}
          >
            <div className='flex gap-1'>
              <p className='hidden md:block'>
                {formatAmountFromWei(balance!.value, balance!.decimals, 3)}
              </p>
              <p className='hidden md:block'>{balance!.symbol}</p>
            </div>

            <div
              className='flex h-5 w-5 items-center justify-center rounded-full'
              style={{ backgroundColor: avatar?.color }}
            >
              {avatar?.emoji}
            </div>
            <p className='hidden md:block'>{shortenAddress(address)}</p>
            <ChevronDownIcon className='text-ic-white size-4' />
          </Button>
        </div>
      ) : (
        <Button
          className='bg-ic-blue-500 dark:bg-ic-blue-300 dark:hover:bg-ic-blue-200 hover:bg-ic-blue-500/90 text-ic-gray-50 dark:text-ic-black block rounded-md px-8 py-1 text-sm font-medium shadow-sm transition-all duration-300 hover:scale-[1.04]'
          onClick={() => open({ view: 'Connect' })}
        >
          Connect
        </Button>
      )}
    </div>
  )
}
