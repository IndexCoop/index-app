import { Text } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'

export const Caption = ({ caption }: { caption: string }) => (
  <Text fontSize={'12px'} fontWeight={500} textColor={colors.icGray2}>
    {caption}
  </Text>
)
