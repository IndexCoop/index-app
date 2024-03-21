'use client'

import { useDisclosure } from '@chakra-ui/react'

import Link from 'next/link'
import { PreSalePopup } from '../popup'
import { preSaleTokens } from '../../constants'
import { PreSaleTokenCard } from '../pre-sale-token-card'

export function PreSaleSection() {
  const {
    isOpen: isPreSalePopupOpen,
    onOpen: onOpenPreSalePopup,
    onClose: onClosePreSalePopup,
  } = useDisclosure()

  const onClickPreSale = () => {
    onOpenPreSalePopup()
  }

  return (
    <div className='py-10'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {preSaleTokens.map((preSaleToken) => (
          <PreSaleTokenCard
            key={preSaleToken.symbol}
            token={preSaleToken}
            onClick={onClickPreSale}
          />
        ))}
      </div>
      <p className='text-ic-gray-400 my-2 text-[10px] font-medium leading-6'>
        * The staking pool for PRTs, which will be launched later in the Index
        Coop app, will not be available to Restricted Persons (including US
        Persons) as defined{' '}
        <Link
          className='underline'
          href='https://indexcoop.com/tokens-restricted-for-restricted-persons'
          target='_blank'
        >
          here
        </Link>
        .
      </p>
      <PreSalePopup
        token={preSaleTokens[0]}
        isOpen={isPreSalePopupOpen}
        onClose={onClosePreSalePopup}
      />
    </div>
  )
}
