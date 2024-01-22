import { Flex } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'

import { Price } from './components/price'
import { RangeSelection } from './components/range-selection'

export function Chart() {
  return (
    <Flex
      align='start'
      bg={colors.icWhite}
      borderRadius='22'
      shadow={'md'}
      w='700px'
    >
      <Flex align='center' flex='row' p='24px' justify='space-between' w='100%'>
        <Price label={'$2,379.95'} />
        <RangeSelection />
      </Flex>
    </Flex>
  )
}
