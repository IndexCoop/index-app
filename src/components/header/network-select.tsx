'use client'

import { ChevronDownIcon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'
import { CaipNetwork, useAppKit, useAppKitNetwork } from '@reown/appkit/react'
import { AssetUtil } from '@reown/appkit-core'
import Image from 'next/image'

export const NetworkSelect = () => {
  const { open } = useAppKit()
  const { caipNetwork } = useAppKitNetwork() as { caipNetwork: CaipNetwork }

  return (
    <Button
      className='bg-ic-black text-ic-white flex gap-2 rounded-md border-none px-4 py-2 transition-all duration-300 hover:scale-[1.04]'
      onClick={() => open({ view: 'Networks' })}
    >
      <Image
        src={AssetUtil.getNetworkImageById(caipNetwork?.imageId) ?? ''}
        alt={caipNetwork?.name}
        className='rounded-full'
        width={24}
        height={24}
      />
      <p className='hidden md:block'>{caipNetwork?.name}</p>
      <ChevronDownIcon className='h-6 w-6' />
    </Button>
  )
}
