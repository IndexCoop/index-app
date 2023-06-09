import { rainbowkitTheme } from '@/lib/styles/theme'
import { WagmiConfig } from 'wagmi'

import { GTMProvider } from '@elgorditosalsero/react-gtm-hook'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'

import { BalanceProvider } from '@/lib/providers/Balances'
import { MarketDataProvider } from '@/lib/providers/MarketData'
import { ProtectionProvider } from '@/lib/providers/Protection'
import { initSentryEventTracking } from '@/lib/utils/api/sentry'
import { chains, wagmiClient } from '@/lib/utils/wagmi'

initSentryEventTracking()

export function Providers({ children }: { children: React.ReactNode }) {
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
              <GTMProvider state={gtmParams}>{children}</GTMProvider>
            </ProtectionProvider>
          </BalanceProvider>
        </MarketDataProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
