'use client'

import { Flex } from '@chakra-ui/react'

import { Swap } from '@/components/swap'
import { useSelectedToken } from '@/lib/providers/selected-token-provider'

export default function SwapPage() {
  const { inputToken, isMinting, outputToken } = useSelectedToken()
  return (
    <Flex
      direction={['column', 'column', 'column', 'row']}
      mx='auto'
      height='inherit'
    >
      <Flex
        className='flex-col gap-8'
        mb={[4, 4, 4, 12]}
        mr={4}
        w={['inherit', '500px']}
      >
        <Swap
          isBuying={isMinting}
          inputToken={inputToken}
          outputToken={outputToken}
        />
      </Flex>
    </Flex>
  )
}
