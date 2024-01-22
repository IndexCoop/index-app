import { Flex, Text } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'

function Price({ label }: { label: string }) {
  return (
    <Text color={colors.icGray9} fontSize='x-large' fontWeight='600'>
      {label}
    </Text>
  )
}

export function Chart() {
  return (
    <Flex bg={colors.icWhite} borderRadius='22' shadow={'md'}>
      <Flex p='24px'>
        <Price label={'$2,379.95'} />
      </Flex>
    </Flex>
  )
}
