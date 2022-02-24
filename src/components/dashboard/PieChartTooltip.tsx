import { colors } from 'styles/colors'

import { Box, Flex, Text } from '@chakra-ui/react'

const DataRow = ({ title, value }: { title: string; value: string }) => {
  return (
    <Flex direction='column'>
      <Text color={colors.black} fontSize='12px' fontWeight='500'>
        {title}
      </Text>
      <Text color={colors.black} fontSize='16px' fontWeight='500'>
        {value}
      </Text>
    </Flex>
  )
}

const Dot = ({ color }: { color: string }) => {
  return <Box backgroundColor={color} borderRadius='8px' w='16px' h='16px' />
}

const PieChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { backgroundColor, title, percent, valueDisplay } = payload[0].payload
    return (
      <Flex
        background={colors.white}
        borderRadius='8px'
        direction='column'
        minW='160px'
        p='16px'
      >
        <Flex align='center' justify='space-between'>
          <Text color={colors.black} fontSize='16px' fontWeight='700'>
            {title}
          </Text>
          <Dot color={backgroundColor} />
        </Flex>
        <Box my='8px'>
          <DataRow title='Allocation' value={percent} />
        </Box>
        {valueDisplay && (
          <DataRow title='Quantity Per Token' value={valueDisplay ?? ''} />
        )}
      </Flex>
    )
  }

  return null
}

export default PieChartTooltip
