import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'

import { colors, useColorStyles } from '@/lib/styles/colors'

type OnrampModalProps = {
  address?: string
  isOpen: boolean
  onClose: () => void
}

export const OnrampModal = (props: OnrampModalProps) => {
  const { isOpen, onClose } = props
  const { styles } = useColorStyles()
  const backgroundColor = styles.background
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered scrollBehavior='inside'>
      <ModalOverlay
        bg='rgba(0, 0, 0, 0.6)'
        backdropFilter='auto'
        backdropBlur='8px'
      />
      <ModalContent
        backgroundColor={backgroundColor}
        borderColor={colors.ic.gray[100]}
        borderRadius='10'
        borderStyle='solid'
        borderWidth='2px'
        h={['60vh', '50vh']}
        m={['16px', 0]}
      >
        <ModalHeader>Select a token</ModalHeader>
        <ModalCloseButton />
        <ModalBody p='16px 0'>
          <Flex justify='flex-end' pr='16px' w='100%'>
            <Text fontSize='sm' fontWeight='500'>
              Quantity Owned
            </Text>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
