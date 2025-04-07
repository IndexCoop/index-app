'use client'

import { Button, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { useAppKit } from '@reown/appkit/react'
import { NetworkUtil } from '@reown/appkit-common'
import { AssetUtil, ChainController } from '@reown/appkit-core'
import { watchAccount } from '@wagmi/core'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'

import { Path } from '@/constants/paths'
import { getNetworkName, useNetwork } from '@/lib/hooks/use-network'
import { useQueryParams } from '@/lib/hooks/use-query-params'
import { chains, wagmiAdapter } from '@/lib/utils/wagmi'

export const NetworkSelect = () => {
  const { chainId: walletChainId } = useAccount()
  const { open } = useAppKit()
  const { chainId, switchChain } = useNetwork()
  const { queryParams, searchParams, updateQueryParams } = useQueryParams()
  const [isNetworkWarningClosed, setIsNetworkWarningClosed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const chain = useMemo(() => chains.find((c) => c.id === chainId), [chainId])

  const imageSrc = useMemo(() => {
    const currentNetwork = ChainController.getAllRequestedCaipNetworks().find(
      (n) => NetworkUtil.caipNetworkIdToNumber(n.caipNetworkId) === chainId,
    )

    return AssetUtil.getNetworkImage(currentNetwork)
  }, [chainId])

  useEffect(() => {
    const unwatch = watchAccount(wagmiAdapter.wagmiConfig, {
      onChange(account, prevAccount) {
        const {
          queryNetwork,
          queryInputToken,
          queryIsMinting,
          queryLeverageType,
          queryOutputToken,
        } = queryParams

        if (
          account.status === 'connected' &&
          prevAccount.status === 'connected' &&
          queryNetwork !== account.chainId
        ) {
          updateQueryParams({
            inputToken: queryInputToken,
            outputToken: queryOutputToken,
            leverageType: queryLeverageType,
            isMinting: queryIsMinting,
            network: account.chainId,
          })
        }
      },
    })

    return () => unwatch()
  }, [queryParams, updateQueryParams])

  return (
    <Popover as='div' className='relative'>
      <PopoverButton
        className='text-ic-white flex items-center gap-2 rounded-md border-none bg-zinc-900 px-4 py-1 text-sm transition-all duration-300 hover:scale-[1.04]'
        onClick={() => open({ view: 'Networks' })}
      >
        {imageSrc && (
          <Image
            src={imageSrc}
            alt='Network icon'
            className='rounded-full'
            width={20}
            height={20}
          />
        )}

        <p className='hidden md:block'>{chain?.name}</p>
        <ChevronDownIcon className='text-ic-white size-4' />
      </PopoverButton>
      <AnimatePresence>
        {chainId !== walletChainId && !isNetworkWarningClosed && (
          <PopoverPanel
            as={motion.div}
            static
            anchor='bottom'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 1 } }}
            className='text-ic-black z-50 mt-8 w-80 !overflow-visible rounded-md border border-gray-300 bg-white p-4 shadow-md dark:border-neutral-600 dark:bg-zinc-900 dark:text-neutral-50'
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {!pathname.startsWith(Path.EARN) && (
              <Button
                className='hover:bg-ic-gray-600 group absolute right-2 top-2 w-5 rounded-md '
                onClick={() => {
                  setIsNetworkWarningClosed(true)

                  if (walletChainId) {
                    const queryParams = new URLSearchParams(searchParams)

                    queryParams.set('network', walletChainId.toString())

                    router.replace(`?${queryParams.toString()}`, {
                      scroll: false,
                    })
                  }
                }}
              >
                <XMarkIcon className='dark:fill-ic-white group-hover:fill-ic-white' />
              </Button>
            )}
            <div className='border-b-ic-gray-300 absolute -top-[18px] left-1/2 h-0 w-0 -translate-x-1/2 border-b-[18px] border-l-[13px] border-r-[13px] border-l-transparent border-r-transparent dark:border-b-neutral-600'></div>
            <div className='border-b-ic-white absolute -top-4 left-1/2 h-0 w-0 -translate-x-1/2 border-b-[16px] border-l-[12px] border-r-[12px] border-l-transparent border-r-transparent dark:border-b-zinc-900'></div>

            <p className='text-md mb-6 mt-2 text-neutral-400'>
              You have followed a link that requires your wallet to switch to{' '}
              <b className='text-neutral-50'>{getNetworkName(chainId)}</b>.
            </p>
            <p className='text-sm text-neutral-400'>
              Your wallet is currently connected to{' '}
              <b className='text-neutral-50'>{getNetworkName(walletChainId)}</b>
              .
            </p>
            <Button
              className='mt-4 w-full rounded-3xl bg-neutral-50 p-2 font-bold text-neutral-900 hover:bg-neutral-100 active:bg-neutral-200'
              onClick={() => chainId && switchChain({ chainId })}
            >
              Switch to {getNetworkName(chainId)}
            </Button>
          </PopoverPanel>
        )}
      </AnimatePresence>
    </Popover>
  )
}
