import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'

type OnrampModalProps = {
  address?: string
  isOpen: boolean
  onClose: () => void
}

export const OnrampModal = (props: OnrampModalProps) => {
  const { isOpen, onClose } = props
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered scrollBehavior='inside'>
      <ModalOverlay className='bg-ic-black bg-opacity-60 backdrop-blur' />
      <ModalContent
        className='border-ic-gray-100 bg-ic-white mx-4 my-0 rounded-xl border-2'
        h={['60vh', '50vh']}
      >
        <ModalHeader>Buy</ModalHeader>
        <ModalCloseButton />
        <ModalBody></ModalBody>
        <div className='text-ic-gray-500 mb-4 text-center text-xs'>
          Powered by Onramper
        </div>
      </ModalContent>
    </Modal>
  )
}
