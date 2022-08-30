import { useColorStyles } from 'styles/colors'

import { Box, Flex, Text } from '@chakra-ui/react'

const TokenPageSectionHeader = ({
  title,
  topMargin,
}: {
  title: String
  topMargin?: string
}) => {
  const { styles } = useColorStyles()
  const topMarginHeader = topMargin ?? ['64px', '80px']

  return (
    <Flex
      direction='row'
      alignItems='center'
      w='100%'
      mt={topMarginHeader}
      mb='24px'
    >
      <Text fontSize='2xl' fontWeight='700'>
        {title}
      </Text>
      <Box w='100%' h='1px' ml='20px' background={styles.border} />
    </Flex>
  )
}

export default TokenPageSectionHeader
