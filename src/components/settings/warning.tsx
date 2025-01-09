import { Flex, Text } from '@chakra-ui/react'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'

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
      <ExclamationCircleIcon className='text-ic-yellow size-4' />
      <Text
        fontSize={'md'}
        fontWeight={500}
        ml='6px'
        textColor={colors.ic.gray[600]}
      >
        Slippage warning
      </Text>
    </Flex>
    <Text
      fontSize={'sm'}
      fontWeight={400}
      mt='2px'
      textColor={colors.ic.gray[600]}
    >
      {getTexts(props.lowSlippage)}
    </Text>
  </Flex>
)
