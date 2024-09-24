'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { WagmiProvider } from 'wagmi'

import { ProtectionProvider } from '@/lib/providers/protection'
import { SignTermsProvider } from '@/lib/providers/sign-terms-provider'
import theme from '@/lib/styles/theme'
import { config, metadata, projectId } from '@/lib/utils/wagmi'

import '@/lib/styles/fonts'
import { AnalyticsProvider } from './analytics-provider'

const queryClient = new QueryClient()

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableOnramp: false,
  enableSwaps: false,
  termsConditionsUrl: 'https://indexcoop.com/terms-of-service',
  privacyPolicyUrl: 'https://indexcoop.com/privacy-policy',
  //  defaultNetwork: networks[0],
  metadata,
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider prepend={true}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <AnalyticsProvider>
              <ProtectionProvider>
                <SignTermsProvider>{children}</SignTermsProvider>
              </ProtectionProvider>
            </AnalyticsProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ChakraProvider>
    </CacheProvider>
  )
}
