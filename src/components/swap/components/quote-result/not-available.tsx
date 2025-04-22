import { Flex } from '@chakra-ui/react'

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
        <p className='text-ic-gray-400 text-sm font-semibold'>
          {type.toUpperCase()}
        </p>
      </Flex>
      <p className='text-ic-gray-300 text-base font-medium'>
        {type} unavailable
      </p>
      <p className='text-ic-gray-300 text-sm font-normal'>
        {`This token is not available for ${text}.`}
      </p>
    </Flex>
  )
}
