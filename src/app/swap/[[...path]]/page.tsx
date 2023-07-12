'use client'

import { useEffect, useState } from 'react'
import { useConnect } from 'wagmi'

import { Box, Flex } from '@chakra-ui/react'

import {
  RethSupplyCapContainer,
  RethSupplyCapOverrides,
  SupplyCapState,
} from '@/components/supply'
import QuickTradeContainer from '@/components/trade'
import { useLedgerStatus } from '@/lib/hooks/useLedgerStatus'
import { ledgerConnector } from '@/lib/utils/wagmi'

export default function SwapPage() {
  const { connectAsync, isIdle } = useConnect()
  const { isRunningInLedgerLive } = useLedgerStatus()

  const [supplyCapOverrides, setSupplyCapOverrides] = useState<
    RethSupplyCapOverrides | undefined
  >(undefined)
  const [showSupplyCap, setShowSupplyCap] = useState(false)

  useEffect(() => {
    if (!isIdle || !isRunningInLedgerLive) return
    console.log('connecting to ledger')
    connectAsync({ connector: ledgerConnector as any }).catch((error: any) => {
      alert('error connecting to ledger: ' + error.toString())
    })
  }, [])

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
        <Box h='100%' w={['100%', '100%', '500px', '370px']}>
          <RethSupplyCapContainer
            state={SupplyCapState.capWillExceed}
            overrides={supplyCapOverrides}
          />
        </Box>
      )}
    </Flex>
  )
}
