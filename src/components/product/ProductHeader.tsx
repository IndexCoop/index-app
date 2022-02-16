import { Flex, Spacer, Text } from '@chakra-ui/layout'
import { Image } from '@chakra-ui/react'

import { Token } from 'constants/tokens'

const ProductPageHeader = (props: {
  tokenData: Token
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
    >
      <Text fontSize='4xl' alignSelf='flex-start' fontWeight='bold'>
        {props.tokenData.name}
      </Text>
      <Spacer />
      <Text fontSize='4xl' marginRight='20px' fontWeight='extrabold'>
        {props.tokenData.symbol}
      </Text>
      <Image src={props.tokenData.image} alt={props.tokenData.name + ' logo'} />
    </Flex>
  )
}

export default ProductPageHeader
