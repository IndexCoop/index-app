import { WarningIcon } from '@chakra-ui/icons'
import { Flex, Text } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'

type WarningProps = {
  lowSlippage: boolean
}

function getTexts(lowSlippage: boolean) {
  if (lowSlippage)
    return 'Transactions below 0.05% slippage may result in a failed transaction.'
  return 'Transactions above 1% slippage may result in an unfavorable trade.'
}

export const Warning = (props: WarningProps) => (
  <Flex direction={'column'}>
    <Flex align={'center'} direction={'row'}>
      <WarningIcon color={colors.icYellow} mr={'6px'} />
      <Text fontSize={'md'} fontWeight={500} textColor={colors.icGray3}>
        Slippage warning
      </Text>
    </Flex>
    <Text fontSize={'sm'} fontWeight={400} mt='2px' textColor={colors.icGray3}>
      {getTexts(props.lowSlippage)}
    </Text>
  </Flex>
)
