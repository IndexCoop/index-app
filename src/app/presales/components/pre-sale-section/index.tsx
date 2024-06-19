'use client'

import { useDisclosure } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { preSaleTokens } from '../../constants'
import { PreSaleStatus, PreSaleToken } from '../../types'
import { PreSalePopup } from '../popup'
import { PreSaleTokenCard } from '../pre-sale-token-card'

import { Disclaimer } from './disclaimer'

export function PreSaleSection() {
  const [presaleToken, setPresaleToken] = useState<PreSaleToken>(
    preSaleTokens[0],
  )
  const {
    isOpen: isPreSalePopupOpen,
    onOpen: onOpenPreSalePopup,
    onClose: onClosePreSalePopup,
  } = useDisclosure()
  const router = useRouter()
  const openPopup = (token: PreSaleToken) => {
    setPresaleToken(token)
    onOpenPreSalePopup()
  }
  return (
    <div className='py-10'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {preSaleTokens.map((preSaleToken) => (
          <PreSaleTokenCard
            key={preSaleToken.symbol}
            token={preSaleToken}
            onClick={() => {
              if (preSaleToken.status === PreSaleStatus.TOKEN_LAUNCHED) {
                router.push(`/swap/eth/${preSaleToken.symbol}`)
              } else {
                openPopup(preSaleToken)
              }
            }}
          />
        ))}
      </div>
      <Disclaimer />
      <PreSalePopup
        token={presaleToken}
        isOpen={isPreSalePopupOpen}
        onClose={onClosePreSalePopup}
      />
    </div>
  )
}
