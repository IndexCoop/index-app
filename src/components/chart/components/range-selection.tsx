import { useState } from 'react'

import { Flex, Text } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'

type RangeSelectionItemProps = {
  label: string
  isSelected: boolean
  onClick: () => void
}

function RangeSelectionItem({
  label,
  onClick,
  isSelected,
}: RangeSelectionItemProps) {
  const color = isSelected ? colors.ic.gray[950] : colors.ic.gray[500]
  const backgroundColor = isSelected ? '#F2F2F2' : 'none'
  return (
    <Flex
      bg={backgroundColor}
      borderRadius='8px'
      cursor='pointer'
      onClick={onClick}
      mr='4px'
      px='8px'
      py='10px'
    >
      <Text color={color} fontSize='sm' fontWeight='600'>
        {label}
      </Text>
    </Flex>
  )
}

const range = ['1H', '1D', '1W', '1M', '1Y', 'ALL']
export function RangeSelection() {
  const [selected, setSelected] = useState(3)
  return (
    <Flex>
      {range.map((range, index) => (
        <RangeSelectionItem
          key={index}
          label={range}
          isSelected={selected === index}
          onClick={() => setSelected(index)}
        />
      ))}
    </Flex>
  )
}
