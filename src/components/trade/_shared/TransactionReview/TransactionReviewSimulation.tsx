import { useColorStyles } from 'styles/colors'

import { Flex, Text } from '@chakra-ui/react'

const TransactionReviewSimulation = () => {
  const { styles } = useColorStyles()
  return (
    <Flex
      border='1px solid'
      borderColor={styles.border}
      borderRadius='16px'
      p='16px'
      w='100%'
    >
      <Text fontSize='lg' fontWeight='500'>
        Transaction simulation
      </Text>
    </Flex>
  )
}

export default TransactionReviewSimulation
