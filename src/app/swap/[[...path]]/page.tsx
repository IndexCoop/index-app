'use client'

import { useMemo, useState } from 'react'

import { Box, Flex } from '@chakra-ui/react'

import {
  RethSupplyCapContainer,
  RethSupplyCapOverrides,
  SupplyCapState,
} from '@/components/supply'
import { Swap } from '@/components/swap'
import { LeveragedRethStakingYield } from '@/constants/tokens'
import { useSelectedToken } from '@/lib/providers/selected-token-provider'

export default function SwapPage() {
  const { inputToken, isMinting, outputToken } = useSelectedToken()

  const [supplyCapOverrides] = useState<RethSupplyCapOverrides | undefined>(
    undefined
  )

  const showRethSupplyCap = useMemo(
    () =>
      inputToken.symbol === LeveragedRethStakingYield.symbol ||
      outputToken.symbol === LeveragedRethStakingYield.symbol,
    [inputToken, outputToken]
  )

  return (
    <Flex
      direction={['column', 'column', 'column', 'row']}
      mx='auto'
      height='inherit'
    >
      <Box mb={[4, 4, 4, 12]} mr={4} w={['inherit', '500px']}>
        <Swap
          isBuying={isMinting}
          inputToken={inputToken}
          outputToken={outputToken}
          // TODO: https://github.com/IndexCoop/index-app/blob/e7a9b8dd7b16901b92c93532707af1216b21a17b/src/components/trade/flashmint/index.tsx#L164C10-L164C29
          // onOverrideSupplyCap={(overrides) => setSupplyCapOverrides(overrides)}
        />
      </Box>
      {showRethSupplyCap && (
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
