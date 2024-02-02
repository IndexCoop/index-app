import { Flex, Text } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'

type QuoteNotAvailableProps = {
  onClick: () => void
  type: string
}

export const QuoteNotAvailable = ({
  onClick,
  type,
}: QuoteNotAvailableProps) => {
  return (
    <Flex
      background={colors.icGray50}
      borderRadius='12'
      cursor='pointer'
      direction={'column'}
      p='16px'
      w='100%'
      h='110px'
      onClick={onClick}
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
