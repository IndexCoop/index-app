import { Flex, Text } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'

interface TradeInputSelectorProps {
  // TODO: title
}

export const TradeInputSelector = (props: TradeInputSelectorProps) => {
  return (
    <Flex
      bg={colors.icWhite}
      border={'1px solid'}
      borderColor={colors.icGray1}
      borderRadius={12}
      p={'16px'}
    >
      <Text fontSize={'12px'} fontWeight={500} textColor={colors.icGray2}>
        You pay
      </Text>
    </Flex>
  )
}
