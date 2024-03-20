import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react'

import { PreSaleWidget } from '../pre-sale-widget'
import { PreSaleToken } from '../../types'

type PreSalePopupProps = {
  isOpen: boolean
  onClose: () => void
  token: PreSaleToken | null
}

export const PreSalePopup = (props: PreSalePopupProps) => {
  const { isOpen, onClose } = props
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered scrollBehavior='inside'>
      <ModalOverlay className='bg-ic-black bg-opacity-60 backdrop-blur' />
      <ModalContent className='bg-transparent shadow-none'>
        <ModalBody className='bg-transparent'>
          <div className='flex flex-row'>
            <PreSaleWidget />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
