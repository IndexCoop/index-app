import {
  Box,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'

type SelectTokenModalProps = {
  isOpen: boolean
  onClose: () => void
}

export const SelectTokenModal = ({
  isOpen,
  onClose,
}: SelectTokenModalProps) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} scrollBehavior={'inside'}>
      <ModalOverlay
        bg='rgba(0, 0, 0, 0.6)'
        backdropFilter='auto'
        backdropBlur='8px'
      />
      <ModalContent>
        <ModalHeader>Select a token</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
