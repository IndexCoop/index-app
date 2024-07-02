'use client'

import { useDisclosure } from '@chakra-ui/react'
import { useState } from 'react'

import { Disclaimer } from '@/app/prt-staking/components/prt-section/disclaimer'
import { PrtCard } from '@/app/prt-staking/components/prt-section/prt-card'
import { PrtPopup } from '@/app/prt-staking/components/prt-section/prt-popup'
import { prts } from '@/app/prt-staking/constants'
import { ProductRevenueToken } from '@/app/prt-staking/types'

export function PrtSection() {
  const [prt, setPrt] = useState<ProductRevenueToken>(prts[0])

  const {
    isOpen: isPrtPopupOpen,
    onOpen: onOpenPrtPopup,
    onClose: onClosePrtPopup,
  } = useDisclosure()

  const openPopup = (token: ProductRevenueToken) => {
    setPrt(token)
    onOpenPrtPopup()
  }

  return (
    <div className='py-10'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {prts.map((prt) => (
          <PrtCard key={prt.tokenData.symbol} onClick={openPopup} token={prt} />
        ))}
      </div>
      <Disclaimer />
      <PrtPopup token={prt} isOpen={isPrtPopupOpen} onClose={onClosePrtPopup} />
    </div>
  )
}
