import { Text } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'

interface TagProps {
  label: string
}

export const Tag = ({ label }: TagProps) => (
  <Text fontSize='12px' fontWeight={600} textColor={colors.ic.gray[600]}>
    {label}
  </Text>
)
