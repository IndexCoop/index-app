import { Flex, Spacer, Text } from '@chakra-ui/layout'
import { Image } from '@chakra-ui/react'

import { ProductToken } from 'constants/productTokens'

const ProductPageHeader = (props: {
  tokenData: ProductToken
  children?: JSX.Element
}) => {
  return (
    <Flex
      direction='row'
      justifyContent='flex-end'
      alignItems='center'
      borderBottom='1px'
      borderColor='white'
      margin='20px 40px'
      padding='10px'
      width='80vw'
    >
      <Text fontSize='4xl' alignSelf='flex-start'>
        {props.tokenData.name}
      </Text>
      <Spacer />
      <Text fontSize='4xl' marginRight='20px'>
        {props.tokenData.symbol}
      </Text>
      <Image src={props.tokenData.image} alt={props.tokenData.name + ' logo'} />
    </Flex>
  )
}

export default ProductPageHeader
