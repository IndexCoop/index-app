'use client'

import { useDisclosure } from '@chakra-ui/react'

import { PreSalePopup } from './components/popup'

export default function Page() {
  const {
    isOpen: isPreSalePopupOpen,
    onOpen: onOpenPreSalePopup,
    onClose: onClosePreSalePopup,
  } = useDisclosure()

  const onClickPreSale = () => {
    onOpenPreSalePopup()
  }

  return (
    <div>
      <div onClick={onClickPreSale}>Open</div>
      <PreSalePopup isOpen={isPreSalePopupOpen} onClose={onClosePreSalePopup} />
    </div>
  )
}
