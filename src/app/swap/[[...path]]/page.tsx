'use client'

import React from 'react'

import { usePathname } from 'next/navigation'
import { useConnect } from 'wagmi'

import { Box, Flex } from '@chakra-ui/react'

import Footer from '@/components/page/Footer'
import Header from '@/components/page/header/Header'
import Page from '@/components/page/Page'
import QuickTradeContainer from '@/components/trade'
import { useLedgerStatus } from '@/lib/hooks/useLedgerStatus'
import { ledgerConnector } from '@/lib/utils/wagmi'

import { Providers } from './providers'

export default function SwapPage() {
  const pathname = usePathname()
  console.log(pathname, 'path')

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
    <Providers>
      <Header />
      <Page>
        <Flex mx='auto'>
          <Box mb={12} w={['inherit', '500px']}>
            <QuickTradeContainer />
          </Box>
        </Flex>
      </Page>
      <Footer />
    </Providers>
  )
}
