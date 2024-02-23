import { Flex, Text } from '@chakra-ui/react'

type QuoteNotAvailableProps = {
  type: string
}

export const QuoteNotAvailable = ({ type }: QuoteNotAvailableProps) => {
  const isFlashmint = type === 'Flash Mint'
  const text = isFlashmint ? 'flash minting' : 'swapping'
  return (
    <Flex
      className='bg-ic-gray-50'
      borderRadius='12'
      cursor='pointer'
      direction={'column'}
      p='16px'
      w='100%'
      h='110px'
    >
      <Flex justify='flex-end' direction='row'>
        <Text className='text-ic-gray-400' fontSize={'sm'} fontWeight={600}>
          {type.toUpperCase()}
        </Text>
      </Flex>
      <Text className='text-ic-gray-300' fontSize={'md'} fontWeight={500}>
        {type} unavailable
      </Text>
      <Text className='text-ic-gray-300' fontSize={'sm'} fontWeight={400}>
        {`This token is not available for ${text}.`}
      </Text>
    </Flex>
  )
}
