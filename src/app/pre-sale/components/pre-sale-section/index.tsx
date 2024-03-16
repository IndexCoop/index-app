'use client'

import { useDisclosure } from '@chakra-ui/react'

import { PreSalePopup } from '../popup'

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
      <div onClick={onClickPreSale}>Open</div>
      <PreSalePopup isOpen={isPreSalePopupOpen} onClose={onClosePreSalePopup} />
    </div>
  )
}
