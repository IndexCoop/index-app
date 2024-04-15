import { Flex } from '@chakra-ui/react'
import { useSize } from '@chakra-ui/react-use-size'
import { useRef } from 'react'

import { colors } from '@/lib/styles/colors'

import { DateRange } from './components/date-range'
import LineChart from './components/line-chart'
import { Price } from './components/price'
import { RangeSelection } from './components/range-selection'

export function Chart() {
  const elementRef = useRef<HTMLDivElement>(null)
  const { width } = useSize(elementRef) ?? { width: null }
  return (
    <Flex
      align='start'
      bg={colors.ic.white}
      borderRadius='22'
      flexDirection={'column'}
      ref={elementRef}
      shadow={'md'}
      w='100%'
      h='100%'
    >
      <Flex
        align={['flex-start', 'center']}
        direction={['column', 'row']}
        gap='8px'
        justify='space-between'
        p='24px 24px 0'
        w='100%'
      >
        <Price label={'$2,379.95'} />
        <RangeSelection />
      </Flex>
      <Flex m='20px 0'>
        <LineChart width={width ?? 200} height={240 - 20} />
      </Flex>
      <Flex mb='20px' w='100%'>
        <DateRange />
      </Flex>
    </Flex>
  )
}
