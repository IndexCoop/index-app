'use client'

import { ChevronDownIcon } from '@chakra-ui/icons'
import { Button, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { watchAccount } from '@wagmi/core'
import { NetworkUtil } from '@web3modal/common'
import { AssetUtil, NetworkController } from '@web3modal/core'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'

import { getNetworkName, useNetwork } from '@/lib/hooks/use-network'
import { useQueryParams } from '@/lib/hooks/use-query-params'
import { chains, config } from '@/lib/utils/wagmi'

export const NetworkSelect = () => {
  const { chainId: walletChainId } = useAccount()
  const { open } = useWeb3Modal()
  const { chainId, switchChain } = useNetwork()
  const { queryParams, searchParams, updateQueryParams } = useQueryParams()
  const [isNetworkWarningClosed, setIsNetworkWarningClosed] = useState(false)
  const router = useRouter()

  const chain = useMemo(() => chains.find((c) => c.id === chainId), [chainId])

  const networks = NetworkController.getRequestedCaipNetworks()

  const imageSrc = useMemo(() => {
    const currentNetwork = networks.find(
      (n) => NetworkUtil.caipNetworkIdToNumber(n.id) === chainId,
    )

    return AssetUtil.getNetworkImageById(currentNetwork?.imageId) ?? ''
  }, [networks, chainId])

  useEffect(() => {
    const unwatch = watchAccount(config, {
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
        className='bg-ic-black text-ic-white flex items-center gap-2 rounded-md border-none px-4 py-2 transition-all duration-300 hover:scale-[1.04]'
        onClick={() => open({ view: 'Networks' })}
      >
        {imageSrc && (
          <Image
            src={imageSrc}
            alt=''
            className='rounded-full'
            width={24}
            height={24}
          />
        )}

        <p className='hidden md:block'>{chain?.name}</p>
        <ChevronDownIcon className='h-6 w-6' />
      </PopoverButton>
      <AnimatePresence>
        {chainId !== walletChainId && !isNetworkWarningClosed && (
          <PopoverPanel
            as={motion.div}
            static
            anchor='bottom'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 1 } }}
            className='dark:bg-ic-black dark:border-ic-gray-800 z-50 mt-8 w-80 !overflow-visible rounded-md border border-gray-300 bg-white p-4 shadow-md dark:text-white'
            exit={{ opacity: 0, scale: 0.95 }}
          >
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
            <div className='border-b-ic-gray-300 dark:border-b-ic-gray-800 absolute -top-[18px] left-1/2 h-0 w-0 -translate-x-1/2 border-b-[18px] border-l-[13px] border-r-[13px] border-l-transparent border-r-transparent'></div>
            <div className='border-b-ic-white dark:border-b-ic-black absolute -top-4 left-1/2 h-0 w-0 -translate-x-1/2 border-b-[16px] border-l-[12px] border-r-[12px] border-l-transparent border-r-transparent'></div>

            <p className='text-md mb-6 mt-2 font-bold'>
              You have followed a link that requires your wallet to switch to{' '}
              <b className='text-ic-blue-500'>{getNetworkName(chainId)}</b>.
            </p>
            <p className='text-sm'>
              Your wallet is currently connected to{' '}
              <b className='text-ic-blue-500'>
                {getNetworkName(walletChainId)}
              </b>
              .
            </p>
            <Button
              className='bg-ic-blue-500 hover:bg-ic-blue-500/90 active:bg-ic-blue-500/80 mt-4 w-full rounded-md p-2 font-bold text-white'
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
