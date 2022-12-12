import { colors } from 'styles/colors'

import { Box, Button, Flex, Image, Spacer, Text } from '@chakra-ui/react'

import closeIcon from 'assets/warning-close-button.svg'

const WarningMessage = (props: {
  message: string
  closeAction: () => void
}) => {
  return (
    <Flex
      background='rgba(250, 191, 0, 0.2)'
      borderColor={colors.icBlue}
      borderWidth='1'
      my='20px'
    >
      <Box background={colors.icBlue} w='6px' />
      <Text fontSize='sm' fontWeight='600' px='16px' py='10px'>
        {props.message}
      </Text>
      <Spacer />
      <Button
        background='rgba(250, 191, 0, 0)'
        border='0'
        onClick={props.closeAction}
      >
        <Image src={closeIcon} alt='close warning message' w='16px' h='16px' />
      </Button>
    </Flex>
  )
}

export default WarningMessage
