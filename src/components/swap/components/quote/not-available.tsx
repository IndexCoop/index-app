import { Flex, Text } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'

export const QuoteNotAvailable = ({ type }: { type: string }) => {
  return (
    <Flex
      background={colors.icGray50}
      borderRadius='12'
      direction={'column'}
      p='16px'
      w='100%'
      h='110px'
    >
      <Flex justify='flex-end' direction='row'>
        <Text fontSize={'sm'} fontWeight={600} textColor={colors.icGray400}>
          {type.toUpperCase()}
        </Text>
      </Flex>
      <Text fontSize={'md'} fontWeight={500} textColor={colors.icGray5}>
        Swap unavailable
      </Text>
      <Text fontSize={'sm'} fontWeight={400} textColor={colors.icGray5}>
        This token is not available for swapping.
      </Text>
    </Flex>
  )
}
