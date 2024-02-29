import { Text } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'

export function Price({ label }: { label: string }) {
  return (
    <Text color={colors.icGray9} fontSize='x-large' fontWeight='600'>
      {label}
    </Text>
  )
}
