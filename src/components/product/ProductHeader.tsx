import { Flex, Spacer, Text } from '@chakra-ui/layout'
import { Image } from '@chakra-ui/react'

import { Token } from 'constants/tokens'

const ProductPageHeaderMobile = (props: { tokenData: Token }) => {
  return (
    <Flex direction='column' justifyContent='flex-end' alignItems='left'>
      <Flex>
        <Image
          src={props.tokenData.image}
          alt={props.tokenData.name + ' logo'}
          w='32px'
          h='32px'
        />
        <Text fontSize='2xl' fontWeight='500' ml='8px'>
          {props.tokenData.symbol}
        </Text>
      </Flex>
      <Text fontSize='xl' fontWeight='700'>
        {props.tokenData.name}
      </Text>
    </Flex>
  )
}

const ProductPageHeader = (props: { isMobile: boolean; tokenData: Token }) => {
  if (props.isMobile) {
    return <ProductPageHeaderMobile tokenData={props.tokenData} />
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
