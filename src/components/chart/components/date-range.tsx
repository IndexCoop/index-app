import { Flex, Text } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'

function DateRangeItem({ label }: { label: string }) {
  return (
    <Text color={colors.icGray2} fontSize='sm' fontWeight='600'>
      {label}
    </Text>
  )
}

const range = ['Dec 26', 'Dec 30', 'Jan 02', 'Jan 09', 'Jan 13', 'Jan 20']
export function DateRange() {
  return (
    <Flex direction={'row'} justify='space-between' mx='20px' w='100%'>
      {range.map((range, index) => (
        <DateRangeItem key={index} label={range} />
      ))}
    </Flex>
  )
}
