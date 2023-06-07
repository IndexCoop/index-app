'use client'

import { usePathname, useRouter } from 'next/navigation'

import React from 'react'

import { Box, Flex } from '@chakra-ui/react'

import Footer from '@/components/page/Footer'
import Header from '@/components/page/header/Header'
import { rainbowkitTheme } from '@/lib/styles/theme'
import { WagmiConfig } from 'wagmi'

import { GTMProvider } from '@elgorditosalsero/react-gtm-hook'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'

import { BalanceProvider } from '@/lib/providers/Balances'
import { MarketDataProvider } from '@/lib/providers/MarketData'
import { ProtectionProvider } from '@/lib/providers/Protection'
import { initSentryEventTracking } from '@/lib/utils/api/sentry'
import { chains, wagmiClient } from '@/lib/utils/wagmi'

import Page from '@/components/page/Page'
import QuickTradeContainer from '@/components/trade'

import '@rainbow-me/rainbowkit/styles.css'

export default function SwapPage() {
  const pathname = usePathname()
  console.log(pathname, 'path')

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

const Providers = (props: { children: any }) => {
  const gtmParams = {
    id: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_CONTAINER_ID ?? '',
  }

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={rainbowkitTheme}
        appInfo={{
          appName: 'Index Coop',
          learnMoreUrl: 'https://indexcoop.com',
        }}
      >
        <MarketDataProvider>
          <BalanceProvider>
            <ProtectionProvider>
              <GTMProvider state={gtmParams}>{props.children}</GTMProvider>
            </ProtectionProvider>
          </BalanceProvider>
        </MarketDataProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

// TODO:
// initSentryEventTracking()
// const container = document.getElementById('root')
// const root = createRoot(container!)
// root.render(
// )
