import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Box, Flex, Text, Tooltip } from '@chakra-ui/react'

export interface TradeInfoItem {
  title: string
  values: string[]
  valuesColor?: string
  tooltip?: string
  subValue?: string
}

const TradeInfoItemRow = ({ item }: { item: TradeInfoItem }) => {
  const { title, values, valuesColor, tooltip, subValue } = item
  return (
    <Flex direction='column'>
      <Text fontSize='14px' fontWeight='500'>
        {title}
        {tooltip && (
          <Tooltip label={tooltip}>
            <InfoOutlineIcon alignSelf={'flex-end'} my={'auto'} ml={'5px'} />
          </Tooltip>
        )}
      </Text>
      {values.map((value, index) => (
        <Flex key={index} flexDir={'row'}>
          <Text fontSize='20px' fontWeight='700' color={valuesColor}>
            {value}
          </Text>
          <Text fontSize={'sm'}>{subValue}</Text>
        </Flex>
      ))}
    </Flex>
  )
}

const TradeInfo = ({ data }: { data: TradeInfoItem[] }) => {
  return (
    <Flex direction='column'>
      {data.map((item, index) => (
        <Box key={index} mb='16px'>
          <TradeInfoItemRow item={item} />
        </Box>
      ))}
    </Flex>
  )
}

export default TradeInfo
