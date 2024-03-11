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
      <ModalContent className='border-ic-gray-100 bg-ic-white mx-4 my-0 rounded-xl border-2'>
        <ModalHeader>Buy</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <iframe
            // style='border-radius: 4px; border: 1px solid #58585f; margin: auto;max-width: 420px'
            src='https://buy.onramper.com?apiKey=pk_prod_01HETEQF46GSK6BS5JWKDF31BT'
            height='630px'
            width='420px'
            title='Onramper widget'
            allow='accelerometer; autoplay; camera; gyroscope; payment'
          ></iframe>
        </ModalBody>
        <div className='text-ic-gray-500 mb-4 text-center text-xs'>
          Powered by Onramper
        </div>
      </ModalContent>
    </Modal>
  )
}
