'use client'

import { Popover, PopoverButton } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useAppKit } from '@reown/appkit/react'
import { NetworkUtil } from '@reown/appkit-common'
import { AssetUtil, ChainController } from '@reown/appkit-core'
import { watchAccount } from '@wagmi/core'
import Image from 'next/image'
import { useEffect, useLayoutEffect, useMemo } from 'react'
import { useAccount } from 'wagmi'

import { useNetwork } from '@/lib/hooks/use-network'
import { useQueryParams } from '@/lib/hooks/use-query-params'
import { chains, wagmiAdapter } from '@/lib/utils/wagmi'

export const NetworkSelect = () => {
  const { chainId: walletChainId } = useAccount()
  const { open } = useAppKit()
  const { chainId, switchChain } = useNetwork()
  const { queryParams, updateQueryParams } = useQueryParams()

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

  useLayoutEffect(() => {
    if (chainId && chainId !== walletChainId) {
      switchChain({ chainId })
    }
  }, [chainId, walletChainId, switchChain])

  return (
    <Popover as='div' className='relative'>
      <PopoverButton
        className='bg-ic-gray-900 text-ic-white flex items-center gap-2 rounded-md border-none px-4 py-1 text-sm transition-all duration-300 hover:scale-[1.04]'
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
    </Popover>
  )
}
