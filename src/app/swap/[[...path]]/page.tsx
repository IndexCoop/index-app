'use client'

import React from 'react'
import { useConnect } from 'wagmi'

import { Box, Flex } from '@chakra-ui/react'

import QuickTradeContainer from '@/components/trade'
import { useLedgerStatus } from '@/lib/hooks/useLedgerStatus'
import { ledgerConnector } from '@/lib/utils/wagmi'

export default function SwapPage() {
  const { connectAsync, isIdle } = useConnect()
  const { isRunningInLedgerLive } = useLedgerStatus()

  React.useEffect(() => {
    if (!isIdle || !isRunningInLedgerLive) return
    console.log('connecting to ledger')
    connectAsync({ connector: ledgerConnector as any }).catch((error: any) => {
      alert('error connecting to ledger: ' + error.toString())
    })
  }, [])

  return (
    <Flex mx='auto'>
      <Box mb={12} w={['inherit', '500px']}>
        <QuickTradeContainer />
      </Box>
    </Flex>
  )
}
