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
      <p className='text-ic-gray-400 my-2 text-[10px] font-medium leading-4'>
        *product-specific PRT staking will be made available in the Index Coop
        app; staking will not be available to Restricted Persons (including US
        Persons) as defined{' '}
        <Link
          className='underline'
          href='https://indexcoop.com/tokens-restricted-for-restricted-persons'
          target='_blank'
        >
          here
        </Link>
        . More information on PRT distribution and staking will be published
        when a successful presale product is formally launched.
      </p>
      <PreSalePopup
        token={preSaleTokens[0]}
        isOpen={isPreSalePopupOpen}
        onClose={onClosePreSalePopup}
      />
    </div>
  )
}
