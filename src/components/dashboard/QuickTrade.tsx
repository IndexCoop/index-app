import { Box, Flex, Spacer, Text } from '@chakra-ui/react'

const QuickTrade = (props: {}) => (
  <Flex
    backgroundColor='#292929'
    border='2px solid #F7F1E4'
    borderRadius='16px'
    direction='column'
    fontWeight='700'
    py='20px'
    px='40px'
  >
    <Flex>
      <Text fontSize='24px'>Quick Trade</Text>
      <Spacer />
    </Flex>
  </Flex>
)

export default QuickTrade
