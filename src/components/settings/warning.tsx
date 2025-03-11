import { Flex } from '@chakra-ui/react'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'

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
      <p className='text-ic-gray-600 ml-1.5 font-medium'>Slippage warning</p>
    </Flex>
    <p className='text-ic-gray-600 mt-0.5 text-sm'>
      {getTexts(props.lowSlippage)}
    </p>
  </Flex>
)
