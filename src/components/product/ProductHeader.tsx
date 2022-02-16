import { Flex, Spacer, Text } from '@chakra-ui/layout'
import { Image } from '@chakra-ui/react'

import { ProductToken } from 'constants/productTokens'

const ProductPageHeader = (props: { tokenData: ProductToken }) => {
  return (
    <Flex
      direction='row'
      justifyContent='flex-end'
      alignItems='center'
      borderBottom='1px'
      borderColor='white'
      padding='10px 0'
    >
      <Text fontSize='4xl' fontWeight='700'>
        {props.tokenData.name}
      </Text>
      <Spacer />
      <Text fontSize='4xl' fontWeight='500' mr='24px'>
        {props.tokenData.symbol}
      </Text>
      <Image
        src={props.tokenData.image}
        alt={props.tokenData.name + ' logo'}
        w='48px'
        h='48px'
      />
    </Flex>
  )
}

export default ProductPageHeader
