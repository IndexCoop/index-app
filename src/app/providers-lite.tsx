'use client'

import { WagmiConfig } from 'wagmi'

import { RainbowKitProvider } from '@rainbow-me/rainbowkit'

import { rainbowkitTheme } from '@/lib/styles/theme'
import { chains, wagmiConfig } from '@/lib/utils/wagmi'

import '@rainbow-me/rainbowkit/styles.css'
import '@/lib/styles/fonts'
import { AnalyticsProvider } from './analytics-provider'

const rainbowKitAppInfo = {
  appName: 'Index Coop',
  learnMoreUrl: 'https://indexcoop.com',
}

// All providers except Chakra
export function ProvidersLite({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        theme={rainbowkitTheme}
        appInfo={rainbowKitAppInfo}
      >
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
