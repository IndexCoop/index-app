import { colors } from 'styles/colors'

import { Box, Flex, Text } from '@chakra-ui/layout'

const ProductPageSectionHeader = ({
  title,
  topMargin,
}: {
  title: String
  topMargin?: string
}) => {
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
      <Box w='100%' h='1px' ml='20px' background={colors.icWhite} />
    </Flex>
  )
}

export default ProductPageSectionHeader
