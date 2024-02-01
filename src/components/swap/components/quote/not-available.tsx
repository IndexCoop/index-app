import { Flex, Text } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'

export const QuoteNotAvailable = ({ type }: { type: string }) => {
  return (
    <Flex direction={'column'}>
      <Flex align='flex-end' direction='row'>
        <Text fontSize={'sm'} fontWeight={600} textColor={colors.icGray4}>
          {type.toUpperCase()}
        </Text>
      </Flex>
      <Text fontSize={'md'} fontWeight={500} textColor={colors.icGray5}>
        Swap unavailable
      </Text>
    </Flex>
  )
}
