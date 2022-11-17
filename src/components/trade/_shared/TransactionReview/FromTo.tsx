import { useColorStyles } from 'styles/colors'

import { Box, Flex, Spacer, Text } from '@chakra-ui/react'

type FromToProps = {
  inputToken: string
  outputToken: string
}

const FromTo = () => {
  const { styles } = useColorStyles()
  return (
    <Flex direction='column' w='100%'>
      <FromToItem />
      <FromToItem />
    </Flex>
  )
}

export default FromTo

const FromToItem = () => {
  const { styles } = useColorStyles()
  return (
    <Flex my='8px'>
      <Text>0.0000001</Text>
      <Spacer />
      <Box
        bg={styles.backgroundInverted}
        w='32px'
        h='32px'
        borderRadius='16px'
      />
    </Flex>
  )
}
