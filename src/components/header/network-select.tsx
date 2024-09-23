'use client'

import { ChevronDownIcon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'
import { NetworkUtil } from '@web3modal/common'
import { AssetUtil, NetworkController } from '@web3modal/core'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import Image from 'next/image'
import { useMemo } from 'react'

import { useNetwork } from '@/lib/hooks/use-network'
import { chains } from '@/lib/utils/wagmi'

export const NetworkSelect = () => {
  const { open } = useWeb3Modal()
  const { chainId } = useNetwork()

  const chain = useMemo(() => chains.find((c) => c.id === chainId), [chainId])

  const networks = NetworkController.getRequestedCaipNetworks()

  const imageSrc = useMemo(() => {
    const currentNetwork = networks.find(
      (n) => NetworkUtil.caipNetworkIdToNumber(n.id) === chainId,
    )

    return AssetUtil.getNetworkImageById(currentNetwork?.imageId)
  }, [networks, chainId])

  console.log(imageSrc)

  return (
    <Button
      className='bg-ic-black text-ic-white flex gap-2 rounded-md border-none px-4 py-2 transition-all duration-300 hover:scale-[1.04]'
      onClick={() => open({ view: 'Networks' })}
    >
      <Image
        src={imageSrc ?? ''}
        alt=''
        className='rounded-full'
        width={24}
        height={24}
      />
      <p className='hidden md:block'>{chain?.name}</p>
      <ChevronDownIcon className='h-6 w-6' />
    </Button>
  )
}
