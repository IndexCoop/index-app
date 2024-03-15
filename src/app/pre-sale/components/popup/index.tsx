import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react'

type PreSalePopupProps = {
  isOpen: boolean
  onClose: () => void
}

export const PreSalePopup = (props: PreSalePopupProps) => {
  const { isOpen, onClose } = props
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered scrollBehavior='inside'>
      <ModalOverlay className='bg-ic-black bg-opacity-60 backdrop-blur' />
      <ModalContent className='border-ic-gray-100 bg-ic-white mx-0 my-0 rounded-xl border-2 p-0'>
        <ModalBody></ModalBody>
      </ModalContent>
    </Modal>
  )
}
