import { Box, Button, Flex, Heading, Image, Text } from '@chakra-ui/react'

import capitalFarmsIcon from 'assets/capital-farms.svg'
import indexPriceIcon from 'assets/index-price.svg'

interface Info {
  image: string
  title: string
  price: string
}

const InfoView = (props: { info: Info }) => {
  const { image, title, price } = props.info
  return (
    <Flex direction='column' mr='16'>
      <Image src={image} alt={title + ' icon'} w='64px' h='64px' />
      <Text fontSize='xl' fontWeight='500' mt='16px'>
        {title}
      </Text>
      <Text fontSize='4xl' fontWeight='200'>
        {price}
      </Text>
    </Flex>
  )
}

const AllAssets = (props: {
  isActive: boolean
  capitalInFarms: string
  indexPrice: string
}) => {
  const { isActive, capitalInFarms, indexPrice } = props

  const capitalInfo = {
    image: capitalFarmsIcon,
    title: 'Capital in Farms',
    price: capitalInFarms,
  }
  const indexInfo = {
    image: indexPriceIcon,
    title: 'INDEX Price',
    price: indexPrice,
  }

  return (
    <Flex direction='column' w='100%'>
      <Heading as='h3' size='md'>
        All Assets
      </Heading>
      <Box border='1px solid #F7F1E4' mt='6px' />
      <Flex mt='5'>
        <Button mr='6' isDisabled={!isActive}>
          Claim All
        </Button>
        <Button isDisabled={!isActive}>Unstake & Claim</Button>
      </Flex>
      <Flex mt='12'>
        <InfoView info={capitalInfo} />
        <InfoView info={indexInfo} />
      </Flex>
    </Flex>
  )
}

export default AllAssets
