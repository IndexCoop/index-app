'use client'

import { WagmiConfig } from 'wagmi'

import { GTMProvider } from '@elgorditosalsero/react-gtm-hook'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'

import { rainbowkitTheme } from '@/lib/styles/theme'
import { chains, wagmiConfig } from '@/lib/utils/wagmi'

import '@rainbow-me/rainbowkit/styles.css'
import '@/lib/styles/fonts'

const rainbowKitAppInfo = {
  appName: 'Index Coop',
  learnMoreUrl: 'https://indexcoop.com',
}

// All providers except Chakra
export function ProvidersLite({ children }: { children: React.ReactNode }) {
  const gtmParams = {
    id: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_CONTAINER_ID ?? '',
  }
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        theme={rainbowkitTheme}
        appInfo={rainbowKitAppInfo}
      >
        <GTMProvider state={gtmParams}>{children}</GTMProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
