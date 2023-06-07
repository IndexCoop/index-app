import { useColorStyles } from '@/lib/styles/colors'

import { Flex, Text } from '@chakra-ui/react'

const TransactionReviewDetails = () => {
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
        Transaction details
      </Text>
    </Flex>
  )
}

export default TransactionReviewDetails
