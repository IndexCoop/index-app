import { colors } from 'styles/colors'

import { Flex, Text } from '@chakra-ui/react'

const DeprecatedTokenMessage = ({
  isDarkMode,
  isMintable,
}: {
  isDarkMode: boolean
  isMintable: boolean
}) => (
  <Flex justify='center'>
    {!isMintable && (
      <Text
        color={isDarkMode ? colors.icBlue8 : colors.icBlue6}
        fontSize={'12px'}
      >
        This token is deprecated and available for selling/redemption only.
      </Text>
    )}
  </Flex>
)

export default DeprecatedTokenMessage
