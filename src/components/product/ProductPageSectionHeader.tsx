import { useICColorMode } from 'styles/colors'

import { Box, Flex, Text } from '@chakra-ui/react'

const ProductPageSectionHeader = ({
  title,
  topMargin,
}: {
  title: String
  topMargin?: string
}) => {
  const { dividerColor } = useICColorMode()
  return (
    <Flex
      direction='row'
      alignItems='center'
      w='100%'
      mt={topMargin ?? '80px'}
      mb='24px'
    >
      <Text fontSize='2xl' fontWeight='700'>
        {title}
      </Text>
      <Box w='100%' h='1px' ml='20px' background={dividerColor} />
    </Flex>
  )
}

export default ProductPageSectionHeader
