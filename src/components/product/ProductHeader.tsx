import { Flex, Spacer, Text } from '@chakra-ui/layout'
import { Image } from '@chakra-ui/react'

import { Token } from 'constants/tokens'

const ProductPageHeaderMobile = (props: { token: Token }) => {
  return (
    <Flex direction='column' justifyContent='flex-end' alignItems='left'>
      <Flex>
        <Image
          src={props.token.image}
          alt={props.token.name + ' logo'}
          w='32px'
          h='32px'
        />
        <Text fontSize='2xl' fontWeight='500' ml='8px'>
          {props.token.symbol}
        </Text>
      </Flex>
      <Text fontSize='xl' fontWeight='700'>
        {props.token.name}
      </Text>
    </Flex>
  )
}

const ProductPageHeader = (props: { isMobile: boolean; token: Token }) => {
  if (props.isMobile) {
    return <ProductPageHeaderMobile token={props.token} />
  }

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
        {props.token.name}
      </Text>
      <Spacer />
      <Text fontSize='4xl' fontWeight='500' mr='24px'>
        {props.token.symbol}
      </Text>
      <Image
        src={props.token.image}
        alt={props.token.name + ' logo'}
        w='48px'
        h='48px'
      />
    </Flex>
  )
}

export default ProductPageHeader
