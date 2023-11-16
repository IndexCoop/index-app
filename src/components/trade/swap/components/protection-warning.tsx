import { colors } from '@/lib/styles/colors'

import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Flex, Link, Text, Tooltip } from '@chakra-ui/react'

export const ProtectionWarning = (props: { isDarkMode: boolean }) => {
  const borderColor = props.isDarkMode ? colors.icWhite : colors.black
  return (
    <Flex
      background={colors.icBlue}
      border='1px solid #000'
      borderColor={borderColor}
      borderRadius={10}
      direction='row'
      textAlign={'center'}
    >
      <Text p={4} justifySelf={'center'} color={colors.black}>
        Not available in your region. Click{' '}
        <Link href='https://indexcoop.com/legal/tokens-restricted-for-us-persons'>
          <Text as='u' color={colors.black}>
            here
          </Text>
        </Link>{' '}
        for more.
        <Tooltip label='Some of our contracts are unavailable to persons or entities who: are citizens of, reside in, located in, incorporated in, or operate a registered office in the U.S.A.'>
          <InfoOutlineIcon
            alignSelf={'flex-end'}
            my={'auto'}
            ml={'18px'}
            color={colors.black}
          />
        </Tooltip>
      </Text>
    </Flex>
  )
}
