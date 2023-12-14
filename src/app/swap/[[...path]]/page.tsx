'use client'

import { useState } from 'react'

import { Box, Flex } from '@chakra-ui/react'

import {
  RethSupplyCapContainer,
  RethSupplyCapOverrides,
  SupplyCapState,
} from '@/components/supply'
import QuickTradeContainer from '@/components/trade'

export default function SwapPage() {
  const [supplyCapOverrides, setSupplyCapOverrides] = useState<
    RethSupplyCapOverrides | undefined
  >(undefined)
  const [showSupplyCap, setShowSupplyCap] = useState(false)

  return (
    <Flex
      direction={['column', 'column', 'column', 'row']}
      mx='auto'
      height='inherit'
    >
      <Box mb={[4, 4, 4, 12]} mr={4} w={['inherit', '500px']}>
        <QuickTradeContainer
          onOverrideSupplyCap={(overrides) => setSupplyCapOverrides(overrides)}
          onShowSupplyCap={(show) => setShowSupplyCap(show)}
        />
      </Box>
      {showSupplyCap && (
        <Box h='100%' w={['100%', '100%', '500px', '360px']}>
          <RethSupplyCapContainer
            state={SupplyCapState.capWillExceed}
            overrides={supplyCapOverrides}
          />
        </Box>
      )}
    </Flex>
  )
}
